import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  ChangePasswordDTO,
  RegistrationDTO,
  ResetPasswordDTO,
} from '../validation';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../../../../prisma/connect';
import { get, omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Helper } from '@/core/utils/helper';
import { EmailService } from '@/core/worker/service/email';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async resetPassword(input: ResetPasswordDTO) {
    let user = await this.findByEmail(input.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const newPassword = Helper.generatePassword();
    const password = await this.generateHashedPassword(newPassword);

    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password,
      },
    });

    //TODO: Should definitely be moved to a separate templating file
    const content = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <html lang="en">  
         
          <body style="background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif">
             <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
                <tr style="width:100%">
                    <td>
                        <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Password Reset</h1>
                        <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Your new password is below - you can change later using the change password feature.</p>
                        <table style="background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                           <tbody>
                              <tr>
                                  <td>
                                       <p style="font-size:30px;line-height:24px;margin:16px 0;text-align:center;vertical-align:middle">${newPassword}</p>
                                  </td>
                              </tr>
                           </tbody>
                        </table>
                    </td>
                </tr>
            </table>
         </body>

       </html>
    `;

    await this.sendResetPasswordEmail(user, content);

    //TODO: Response can be standardized
    return {
      message: 'An email has been sent to your registered email address',
    };
  }

  async changePassword(input: ChangePasswordDTO, userId: string) {
    let user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isValidPassword = await this.verifyHashedPassword(
      input.old_password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Password is incorrect, please try again');
    }

    user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await this.generateHashedPassword(input.new_password),
      },
    });

    return user;
  }
  async register(user: RegistrationDTO) {
    if (await this.findByEmail(get(user, 'email'))) {
      throw new ConflictException(`User ${get(user, 'email')} already exists`);
    }

    const generatedPassword = Helper.generatePassword(15);
    const password = await this.generateHashedPassword(generatedPassword);

    const data = await this.prisma.user.create({
      data: {
        ...user,
        password,
      },
    } as any);

    const payload = { username: data.email, sub: data.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      meta: { accessToken, code: HttpStatus.CREATED },
      data: {
        email: data.email,
        password: generatedPassword,
      },
    };
  }

  async generateHashedPassword(password: string): Promise<string> {
    const salt = this.config.get<string>('encryption.salt');
    return await hash(password, salt);
  }

  async verifyHashedPassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const verified = await this.verifyHashedPassword(pass, user.password);
    if (verified) {
      const payload = { username: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      return {
        data: omit(user, ['password']),
        meta: {
          accessToken: accessToken,
        },
      };
    }
    return null;
  }

  sendResetPasswordEmail(user: User, content: string) {
    return this.emailService.send({
      to: { email: user.email, name: user.email },
      from: { email: this.config.get('workers.email.noReply') },
      subject: 'Reset your password',
      content,
    });
  }
}

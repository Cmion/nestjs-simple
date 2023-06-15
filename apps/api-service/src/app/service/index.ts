import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistrationDTO } from '../validation';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../../../../prisma/connect';
import { get, omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Helper } from '@/core/utils/helper';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
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

  findByEmail(email: string): Promise<User | null> {
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
}

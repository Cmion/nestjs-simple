import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AppService } from '../service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.appService.validateUser(username, password);
    if (!user) {
      throw new NotFoundException('User or password does not exist');
    }
    return user;
  }
}

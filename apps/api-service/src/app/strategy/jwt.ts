import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { omit } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('encryption.jwtSecretKey'),
    });
  }

  async validate(payload: any) {
    const user = await this.appService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      ...omit(user, ['password']),
      authId: user.id,
    };
  }
}

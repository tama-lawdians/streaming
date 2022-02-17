import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // request 에서 jwt 추출하는 방법
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 만료된 jwt가 왔을 때, 요청 거부
      ignoreExpiration: false,

      // 비밀키
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return await this.authService.jwtValidate(payload);
  }
}

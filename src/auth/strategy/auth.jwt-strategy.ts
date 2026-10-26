import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {
  ENV_JWT_ACCESS_SECRET_KEY,
  ENV_JWT_REFRESH_SECRET_KEY,
} from '../../common/const/env-keys-values.const';
import { Payload } from '../const/auth.payload.const';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(ENV_JWT_ACCESS_SECRET_KEY),
    });
  }

  async validate(payload: Payload) {
    return {
      id: payload.sub,
      email: payload.email,
      token: payload.tokenType,
    };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(ENV_JWT_REFRESH_SECRET_KEY),
    });
  }

  async validate(payload: Payload) {
    return {
      id: payload.sub,
      email: payload.email,
      token: payload.tokenType,
    };
  }
}

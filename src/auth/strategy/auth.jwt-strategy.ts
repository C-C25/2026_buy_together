import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('올바른 토큰이 아닙니다.');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('올바른 토큰이 아닙니다.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      tokenType: payload.tokenType,
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
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('올바른 토큰이 아닙니다.');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('올바른 토큰이 아닙니다.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      tokenType: payload.tokenType,
    };
  }
}

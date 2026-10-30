import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth.register.dto';
import {
  ENV_HASH_ROUND_KEY,
  ENV_JWT_ACCESS_SECRET_KEY,
  ENV_JWT_REFRESH_SECRET_KEY,
} from '../common/const/env-keys-values.const';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  private accessSignPayload(
    user: Pick<UsersEntity, 'email' | 'id'>,
    tokenType: 'access',
  ) {
    const accessSign = {
      sub: user.id,
      email: user.email,
      tokenType,
    };

    return this.jwtService.sign(accessSign, {
      secret: this.configService.getOrThrow<string>(ENV_JWT_ACCESS_SECRET_KEY),
      expiresIn: '5m',
    });
  }

  private refreshSignPayload(
    user: Pick<UsersEntity, 'email' | 'id'>,
    tokenType: 'refresh',
  ) {
    const refreshSign = {
      sub: user.id,
      email: user.email,
      tokenType,
    };

    return this.jwtService.sign(refreshSign, {
      secret: this.configService.getOrThrow<string>(ENV_JWT_REFRESH_SECRET_KEY),
      expiresIn: '1h',
    });
  }

  // TODO Redis 적용
  rotateAccess(user: Pick<UsersEntity, 'email' | 'id'>) {
    // const storedRefreshToken = await this.redisClient.get(
    //   `refresh_token_${user.id}`,
    // );

    // if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    //   throw new UnauthorizedException('유효하지 않은 Refresh Token 입니다.');
    // }

    return {
      accessToken: this.accessSignPayload(user, 'access'),
    };
  }

  // TODO Redis 적용
  rotateRefresh(user: Pick<UsersEntity, 'email' | 'id'>) {
    // const storedRefreshToken = await this.redisClient.get(
    //   `refresh_token_${user.id}`,
    // );

    // if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    //   throw new UnauthorizedException('유효하지 않은 Refresh Token 입니다.');
    // }

    return {
      refreshToken: this.refreshSignPayload(user, 'refresh'),
    };
  }

  loginUser(user: Pick<UsersEntity, 'email' | 'id'>) {
    return {
      accessToken: this.accessSignPayload(user, 'access'),
      refreshToken: this.refreshSignPayload(user, 'refresh'),
    };
  }

  async validateUser(user: Pick<UsersEntity, 'email' | 'password'>) {
    const validateEmail = await this.usersService.validateUserWithEmail(
      user.email,
    );

    if (!validateEmail) {
      throw new UnauthorizedException('이메일 혹은 비밀번호가 틀렸습니다.');
    }

    const validatePassword = await bcrypt.compare(
      user.password,
      validateEmail.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('이메일 혹은 비밀번호가 틀렸습니다.');
    }

    return validateEmail;
  }

  async register(dto: AuthRegisterDto) {
    const hash = await bcrypt.hash(
      dto.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUND_KEY)!),
    );

    const user = await this.usersService.createUser({
      ...dto,
      password: hash,
    });
    return this.loginUser(user);
  }

  async logoutUser(userId: string) {
    await this.redisClient.del(`refresh_token_${userId}`);

    return {
      message: '로그아웃 되었습니다.',
    };
  }
}

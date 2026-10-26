import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from './strategy/auth.jwt-strategy';
import { LocalStrategy } from './strategy/auth.local-strategy';
import { JwtRefreshTokenGuard } from './guard/auth.jwt-refresh.guard';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  exports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    JwtRefreshTokenGuard,
  ],
})
export class AuthModule {}

import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { LocalGuard } from './guard/auth.local.guard';
import { JwtRefreshTokenGuard } from './guard/auth.jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  login(@Req() req) {
    return this.authService.loginUser(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logoutUser(req.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('/token/refresh')
  refreshToken(@Req() req) {
    return this.authService.rotateRefresh(req.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('/token/access')
  accessToken(@Req() req) {
    return this.authService.rotateAccess(req.user);
  }
}

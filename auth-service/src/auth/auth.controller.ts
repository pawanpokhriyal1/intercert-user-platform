import { Body, Controller, Get, Headers, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { InternalChangePasswordDto, LoginDto, RegisterDto, ValidateDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('auth/validate')
  validate(@Body() dto: ValidateDto) {
    return this.authService.validate(dto.token);
  }

  @Post('auth/logout')
  logout(@Headers('authorization') authorization = '') {
    const token = authorization.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing bearer token');
    return this.authService.logout(token);
  }

  @Post('internal/change-password')
  internalChangePassword(@Body() dto: InternalChangePasswordDto) {
    return this.authService.internalChangePassword(dto);
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() };
  }
}

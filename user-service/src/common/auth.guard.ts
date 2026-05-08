import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing bearer token');

    try {
      const response = await axios.post(`${this.config.get('AUTH_SERVICE_URL')}/auth/validate`, { token });
      req.user = response.data;
      req.token = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { DataSource, MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AuthCredential } from '../database/auth-credential.entity';
import { RevokedToken } from '../database/revoked-token.entity';
import { InternalChangePasswordDto, LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  private credentials: MongoRepository<AuthCredential>;
  private revoked: MongoRepository<RevokedToken>;

  constructor(
    @InjectDataSource() dataSource: DataSource,
    private readonly config: ConfigService,
  ) {
    this.credentials = dataSource.getMongoRepository(AuthCredential);
    this.revoked = dataSource.getMongoRepository(RevokedToken);
  }

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase();
    const existing = await this.credentials.findOneBy({ email: normalizedEmail });
    if (existing) throw new BadRequestException('Email is already registered');

    const userId = uuid();
    const now = new Date();
    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.credentials.save({ userId, email: normalizedEmail, passwordHash, createdAt: now, updatedAt: now });

    await axios.post(`${this.config.get('USER_SERVICE_URL')}/internal/users`, {
      userId,
      name: dto.name,
      email: normalizedEmail,
      phone: dto.phone,
    });

    setTimeout(() => console.log(`[welcome-email] Welcome ${dto.name} <${normalizedEmail}>`), 0);
    return { userId, email: normalizedEmail, message: 'Registered successfully' };
  }

  async login(dto: LoginDto) {
    const credential = await this.credentials.findOneBy({ email: dto.email.toLowerCase() });
    if (!credential || !(await bcrypt.compare(dto.password, credential.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = jwt.sign(
      { sub: credential.userId, email: credential.email },
      this.config.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: (this.config.get<string>('JWT_EXPIRES_IN') || '1d') as any },
    );
    console.log(`[login-event] ${credential.email} ${new Date().toISOString()}`);
    return { token, userId: credential.userId };
  }

  async validate(token: string) {
    const revoked = await this.revoked.findOneBy({ token });
    if (revoked) throw new UnauthorizedException('Token has been revoked');

    try {
      const payload = jwt.verify(token, this.config.getOrThrow<string>('JWT_SECRET')) as jwt.JwtPayload;
      return { valid: true, userId: payload.sub, email: payload.email };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(token: string) {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
    await this.revoked.save({
      token,
      expiresAt: new Date((decoded?.exp || Math.floor(Date.now() / 1000) + 86400) * 1000),
      createdAt: new Date(),
    });
    return { message: 'Logged out successfully' };
  }

  async internalChangePassword(dto: InternalChangePasswordDto) {
    const credential = await this.credentials.findOneBy({ userId: dto.userId });
    if (!credential || !(await bcrypt.compare(dto.oldPassword, credential.passwordHash))) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    credential.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    credential.updatedAt = new Date();
    await this.credentials.save(credential);
    return { message: 'Password changed successfully' };
  }
}

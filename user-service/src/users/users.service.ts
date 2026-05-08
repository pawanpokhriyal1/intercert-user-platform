import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { DataSource, MongoRepository } from 'typeorm';
import { UserProfile } from '../database/user-profile.entity';
import { ChangePasswordDto, CreateUserDto, UpdateProfileDto } from './dto';

type CacheEntry = { expiresAt: number; profile: UserProfile };

@Injectable()
export class UsersService {
  private users: MongoRepository<UserProfile>;
  private cache = new Map<string, CacheEntry>();

  constructor(
    @InjectDataSource() dataSource: DataSource,
    private readonly config: ConfigService,
  ) {
    this.users = dataSource.getMongoRepository(UserProfile);
  }

  async createInternal(dto: CreateUserDto) {
    const existing = await this.users.findOneBy({ userId: dto.userId });
    if (existing) return existing;

    const now = new Date();
    return this.users.save({ ...dto, email: dto.email.toLowerCase(), createdAt: now, updatedAt: now });
  }

  async getProfile(userId: string) {
    const cached = this.cache.get(userId);
    if (cached && cached.expiresAt > Date.now()) return cached.profile;

    const profile = await this.users.findOneBy({ userId });
    if (!profile) throw new NotFoundException('Profile not found');
    this.cache.set(userId, { profile, expiresAt: Date.now() + 120000 });
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getProfile(userId);
    Object.assign(profile, { ...dto, email: dto.email.toLowerCase(), updatedAt: new Date() });
    const saved = await this.users.save(profile);
    this.cache.delete(userId);
    console.log(`[profile-updated] userId=${userId}`);
    return saved;
  }

  async uploadPhoto(userId: string, filename?: string) {
    if (!filename) throw new BadRequestException('Photo file is required');
    const profile = await this.getProfile(userId);
    profile.photoUrl = `/uploads/${filename}`;
    profile.updatedAt = new Date();
    const saved = await this.users.save(profile);
    this.cache.delete(userId);
    return saved;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const response = await axios.post(`${this.config.get('AUTH_SERVICE_URL')}/internal/change-password`, {
      userId,
      oldPassword: dto.oldPassword,
      newPassword: dto.newPassword,
    });
    return response.data;
  }
}

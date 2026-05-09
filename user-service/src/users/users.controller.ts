import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../common/auth.guard';
import { ChangePasswordDto, CreateUserDto, UpdateProfileDto } from './dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('internal/users')
  createInternal(@Body() dto: CreateUserDto) {
    return this.usersService.createInternal(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId, req.user.email);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto, req.user.email);
  }

  @Post('profile/photo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`),
    }),
  }))
  uploadPhoto(@Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.usersService.uploadPhoto(req.user.userId, file?.filename);
  }

  @Post('password/change')
  @UseGuards(AuthGuard)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async dashboard(@Req() req: any) {
    const profile = await this.usersService.getProfile(req.user.userId, req.user.email);
    return { message: `Welcome ${profile.name}` };
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'user-service', timestamp: new Date().toISOString() };
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from '../service';
import { LoginDTO, RegistrationDTO, ResetPasswordDTO } from '../validation';
import { JwtAuthGuard, LocalAuthGuard } from '@/core/utils/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() input: RegistrationDTO) {
    return await this.service.register(input);
  }
  @ApiBearerAuth()
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(@Body() input: ResetPasswordDTO, @Req() req: Request) {
    return await this.service.resetPassword(input, (req.user as any).id);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO, @Req() req) {
    return req.user;
  }
}

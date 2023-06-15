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
import {
  ChangePasswordDTO,
  LoginDTO,
  RegistrationDTO,
  ResetPasswordDTO,
} from '../validation';
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
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(@Body() input: ChangePasswordDTO, @Req() req: Request) {
    return await this.service.changePassword(input, (req.user as any).id);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(@Body() input: ResetPasswordDTO) {
    return await this.service.resetPassword(input);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO, @Req() req) {
    return req.user;
  }
}

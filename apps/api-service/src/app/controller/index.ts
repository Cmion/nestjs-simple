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
import { RegistrationDTO } from '../validation';
import { LocalAuthGuard } from '@/core/utils/guards';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() input: RegistrationDTO) {
    return await this.service.register(input);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req) {
    return req.user;
  }
}

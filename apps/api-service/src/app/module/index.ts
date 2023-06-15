import { Global, Module } from '@nestjs/common';
import { AppController } from '../controller';
import { AppService } from '../service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { PrismaService } from '../../../../../prisma/connect';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../strategy/local';
import { JwtStrategy } from '../strategy/jwt';
import { StockModule } from '../../stock/module';
import { CoreModule } from '@/core/module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || 172800 },
    }),
    CoreModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [LocalStrategy, JwtStrategy, AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

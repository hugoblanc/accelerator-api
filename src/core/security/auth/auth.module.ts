import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from './auth.service';
import * as process from 'process';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // Add other options here
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from './auth.service';
import { LoginController } from './login/login.controller';
import * as process from 'process';
import {UserService} from "../../../user/application/user.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // Add other options here
    }),
  ],
  controllers: [LoginController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}

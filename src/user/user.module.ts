import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './application/user.controller';
import { AuthService } from '../core/security/auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}

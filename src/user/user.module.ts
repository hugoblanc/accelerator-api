import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import {UserController} from "./application/user.controller";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

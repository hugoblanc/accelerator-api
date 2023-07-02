import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UnauthorizedException, UseGuards, Get, Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {JwtAuthGuard} from "../../core/security/guards/jwt-auth.guard";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      throw new NotFoundException('Username already exists');
    }

    const user = await this.userService.createUser(email, password);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentUser(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUserById(userId);
  }
}

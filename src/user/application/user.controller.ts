import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body()
    body: {
      email: string;
      password: string;
      lastname: string;
      firstname: string;
    },
  ) {
    const { email, password, firstname, lastname } = body;
    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      throw new NotFoundException('Username already exists');
    }

    const user = await this.userService.createUser(
      email,
      password,
      firstname,
      lastname,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentUser(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUserById(userId);
  }
}

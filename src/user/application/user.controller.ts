import {Controller, Post, Body, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { UserService } from './user.service';

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

  @Post('login')
  async loginUser(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    try {
      const token = await this.userService.loginUser(email, password);
      return { token };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}

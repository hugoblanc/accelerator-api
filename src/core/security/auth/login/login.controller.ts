import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../../user/application/user.service';

@Controller('login')
export class LoginController {
  constructor(private userService: UserService) {}

  @Post()
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

import {Controller, Get, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {GoogleOauthGuard} from "../guards/google-oauth.guards";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    return token;
  }
}

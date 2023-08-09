import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as process from 'process';
import { JwtPayload } from './jwt-payload';
import { ContextService } from '../context/context.service';
import {UserService} from "../../user/application/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private readonly contextService: ContextService,
              private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserById(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    this.contextService.setUserId(payload.sub);
    return { email: payload.email, userId: payload.sub };
  }
}

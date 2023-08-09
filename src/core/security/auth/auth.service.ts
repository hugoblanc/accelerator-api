import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { User } from '../../../user/domain/user';
import * as jwt from 'jsonwebtoken';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../../../user/application/user.service";
import {JwtPayload} from "../jwt-payload";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  private readonly jwtSecret: string = process.env.JWT_SECRET;

  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.userService.getUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: User) {
    try {
      const newUser = await this.userService.createUser(user.email, user.password, user.firstname, user.lastname,);
      // newUser.username = generateFromEmail(user.email, 5);

      // await this.userRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

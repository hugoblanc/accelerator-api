import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string =
    'jkazntjkaznbtjkzekzentkjznglkzenkzenkjzentk';

  generateToken(user: User): string {
    const payload = { username: user.email, sub: user.id };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }
}

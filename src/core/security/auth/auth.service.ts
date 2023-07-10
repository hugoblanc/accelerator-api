import { Injectable } from '@nestjs/common';
import { User } from '../../../user/domain/user';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string = process.env.JWT_SECRET;

  generateToken(user: User): string {
    const payload = { username: user.email, sub: user.id };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }
}

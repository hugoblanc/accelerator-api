import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly jwtSecret: string = process.env.JWT_SECRET;

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
        req['user'] = decoded;
      } catch (error) {
        // Handle error
      }
    }
    next();
  }
}

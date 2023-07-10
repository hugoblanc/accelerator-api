import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as process from 'process';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // Vous pouvez implémenter une logique personnalisée pour valider l'utilisateur
    // Par exemple, vérifier si l'utilisateur existe dans la base de données
    // et retourner l'utilisateur ou null s'il n'est pas valide
    return { username: payload.username, userId: payload.sub };
  }
}

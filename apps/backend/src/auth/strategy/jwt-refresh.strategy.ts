import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { IncomingHttpHeaders } from 'http';
import { jwtPayload } from './type';

type JwtRefreshRequest = {
  headers: IncomingHttpHeaders;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true, // Allows us to access the raw request to extract the token string
    });
  }

  validate(req: JwtRefreshRequest, payload: jwtPayload) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const refreshToken = authorization.replace('Bearer ', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    // Attaches credentials and the raw token to req.user
    return { userId: payload.userId, username: payload.username, refreshToken };
  }
}

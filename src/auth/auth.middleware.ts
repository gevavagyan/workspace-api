import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwt/jwt.service';
import { ERROR_MESSAGES } from '../shared/constants/api-messages.constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(ERROR_MESSAGES.tokenMissing);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.tokenMissing);
    }

    try {
      const jwtPayload = this.jwtAuthService.verifyToken(token);

      req.user = jwtPayload.id;

      next();
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.tokenExpired);
    }
  }
}

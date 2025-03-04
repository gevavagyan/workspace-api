import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from "./jwt.constants";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}
    generateAccessToken(payload: any): string {
        return this.jwtService.sign(payload, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
    }
    generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        });
    }
    verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }
}

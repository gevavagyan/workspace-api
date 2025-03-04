import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "../user/user.repository";
import {CreateUserDto} from "../user/dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {EmailService} from "../email/email.service";
import {JwtAuthService} from "../jwt/jwt.service";
import {ConfigService} from "@nestjs/config";
import {SignInDto} from "./dto/sign-in.dto";
import {DB_DRIVER_ERROR_CODES, ERROR_MESSAGES, ERROR_TYPES} from "../shared/constants/api-messages.constants";
import {QueryFailedError} from "typeorm";
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly emailService: EmailService,
        private readonly userRepository: UserRepository,
        private readonly jwtAuthService: JwtAuthService,
        private readonly configService: ConfigService,
    ) {}

    async signIn(credentials: SignInDto, res: Response): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOneByEmail(credentials.email);
        if (!user) {
            throw new UnauthorizedException({
                type: ERROR_TYPES.CLIENT_ERROR,
                data: {email: ERROR_MESSAGES.invalidCredentials}
            });
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException({
                type: ERROR_TYPES.CLIENT_ERROR,
                data: {password: ERROR_MESSAGES.wrongPassword}
            });
        }

        if(!user.verified) {
            throw new UnauthorizedException({
                type: ERROR_TYPES.CLIENT_ERROR,
                data: {email: ERROR_MESSAGES.unVerifiedEmailAddress}
            });
        }

        const accessToken = this.jwtAuthService.generateAccessToken({ id: user.id, email: user.email },);
        const refreshToken = this.jwtAuthService.generateRefreshToken({ id: user.id, email: user.email });

        const NODE_ENV = this.configService.get<string>('NODE_ENV');

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }

    async signUp(userDto: CreateUserDto): Promise<any> {
        const { email, fullName, password } = userDto;
        const hashedPassword = await this.hashPassword(password);

        try {
            const user = await this.userRepository.createUser({
                email,
                fullName,
                password: hashedPassword,
            });

            const token = this.jwtAuthService.generateRefreshToken({ id: user.id, email, fullName });
            const verificationLink = `${this.configService.get<string>('API_ORIGIN')}/auth/verify-email?token=${token}`;

            await this.emailService.sendVerificationMail({
                email,
                fullName,
                verificationLink,
            });

            return user;
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError.code == DB_DRIVER_ERROR_CODES.conflictsWithServerState) {
                throw new ConflictException(
                    {
                        type: ERROR_TYPES.CLIENT_ERROR,
                        data: {email: ERROR_MESSAGES.emailAlreadyInUse}
                    }
                );
            } else {
                throw error;
            }
        }
    }

    async refreshToken(refreshToken: string, res: Response): Promise<{ accessToken: string }> {
        const payload = this.jwtAuthService.verifyToken(refreshToken);
        if (!payload) {
            throw new UnauthorizedException(ERROR_MESSAGES.refreshTokenExpired);
        }

        const user = await this.userRepository.findByPK(payload.id);
        if (!user) {
            throw new UnauthorizedException(ERROR_MESSAGES.userNotFound);
        }

        const accessToken = this.jwtAuthService.generateAccessToken({ id: user.id, email: user.email });

        const NODE_ENV = this.configService.get<string>('NODE_ENV');


        const newRefreshToken = this.jwtAuthService.generateRefreshToken({ id: user.id, email: user.email });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }

    async verifyEmail(token: string, res: Response): Promise<string> {
        const clientUrl = this.configService.get<string>('CLIENT_ORIGIN');

        const payload = this.jwtAuthService.verifyToken(token);
        if (!payload) {
            return `${clientUrl}/login?verification=failed`;
        }

        await this.userRepository.update(payload.id, { verified: true });

        const NODE_ENV = this.configService.get<string>('NODE_ENV');
        const refreshToken = this.jwtAuthService.generateRefreshToken({ id: payload.id, email: payload.email });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return `${clientUrl}/login?verification=succeed`;
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 11);
    }
}

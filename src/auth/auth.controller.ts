import {Body, Controller, Get, Post, Query, Redirect, Req, Res, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {SignInDto} from "./dto/sign-in.dto";
import { Response, Request } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('sign-up')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
    }

    @Post('sign-in')
    async signIn(@Body() loginUserDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.signIn(loginUserDto, res);
    }

    @Post('refresh-token')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req?.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return this.authService.refreshToken(refreshToken, res);
    }

    @Get('verify-email')
    @Redirect()
    async verifyEmail(@Query('token') token: string, @Res() res: Response) {
        const clientUrl = await this.authService.verifyEmail(token, res);
        return { url: clientUrl };
    }
}

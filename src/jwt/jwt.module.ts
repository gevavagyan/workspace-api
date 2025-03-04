import { Module } from '@nestjs/common';
import {JwtAuthService} from "./jwt.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";


@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtAuthService],
    exports: [JwtAuthService]
})
export class JwtAuthModule {}

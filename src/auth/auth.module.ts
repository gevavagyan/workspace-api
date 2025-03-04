import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {EmailModule} from "../email/email.module";
import {JwtAuthModule} from "../jwt/jwt.module";

@Module({
  imports: [UserModule, EmailModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}

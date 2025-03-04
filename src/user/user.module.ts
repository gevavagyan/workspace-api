import {forwardRef, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {UserRepository} from "./user.repository";
import {AuthMiddleware} from "../auth/auth.middleware";
import {JwtAuthModule} from "../jwt/jwt.module";
import {WorkspaceModule} from "../workspace/workspace.module";

@Module({
  imports: [
    JwtAuthModule,
    forwardRef(() => WorkspaceModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .forRoutes(UserController);
  }
}

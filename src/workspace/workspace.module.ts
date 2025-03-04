import {forwardRef, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtAuthModule} from "../jwt/jwt.module";
import {Workspace} from "./entities/workspace.entity";
import {AuthMiddleware} from "../auth/auth.middleware";
import {UserModule} from "../user/user.module";
import {WorkspaceRepository} from "./workspace.repository";

@Module({
  imports: [
    JwtAuthModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Workspace]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
  exports: [WorkspaceService, WorkspaceRepository]
})
export class WorkspaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WorkspaceController);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserRepository} from "./user.repository";
import {WorkspaceRepository} from "../workspace/workspace.repository";

@Injectable()
export class UserService {
  constructor(
      private readonly userRepository: UserRepository,
      private readonly workspaceRepository: WorkspaceRepository
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }
  findOne(id: number) {
    return this.userRepository.findByPK(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getUserWorkspaces(userId) {
    return this.workspaceRepository.getUserWorkspaces(userId);
  }
}

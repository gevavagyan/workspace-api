import {Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./user.decorator";
import {ERROR_MESSAGES} from "../shared/constants/api-messages.constants";

@Controller('user')
export class UserController {
  constructor(
      private readonly userService: UserService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findOne(@User() user: any) {
    return this.userService.findOne(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get(':id/workspaces')
  async getUserWorkspaces(@Param('id') id: number, @User() user: any) {
    if (Number(id) !== user) {
      throw new ForbiddenException(ERROR_MESSAGES.accessDenied);
    } else {
      return this.userService.getUserWorkspaces(id);
    }
  }
}

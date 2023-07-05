import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDTO) {
    return this.userService.createUser(createUser);
  }
}

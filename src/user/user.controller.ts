import { Controller, Post, Inject, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDataInterface } from 'src/interfaces/UserDataInterface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(
    @Inject(UserService) private userService: UserService
  ) {}

  @Post('register')
  register(
    @Body() userData: UserDataInterface,
    @Res() res: Response
  ): Promise<any> {
    return this.userService.register(userData, res);
  }

}

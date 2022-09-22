import { Body, Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/UserDecorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginDataInterface } from 'src/interfaces/LoginDataInterface';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(AuthService) private authService: AuthService
  ) {}


  @Post('/login')
  login(
    @Body() loginData: LoginDataInterface,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.login(loginData, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(
    @UserDecorator() user: User,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.logout(user, res);
  }

}

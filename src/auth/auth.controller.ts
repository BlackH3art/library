import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDataInterface } from 'src/interfaces/LoginDataInterface';
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

}

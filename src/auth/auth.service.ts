import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { LoginDataInterface } from 'src/interfaces/LoginDataInterface';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

import { JwtPayload } from './jwt.strategy';

import { hashPassword } from 'src/utils/hashPassword';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserResponseInterface } from 'src/interfaces/UserDataInterface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}



  private createToken(currentToken: string): { accessToken: string, expiresIn: number } {

    const payload: JwtPayload = { id: currentToken };
    const expiresIn: number = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.SECRET, { expiresIn });

    return {
      accessToken,
      expiresIn
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token: string;
    let userWithThisToken: User; 

    try {
      do {
        token = uuid();
        userWithThisToken = await this.userRepository.findOne({ where: { currentToken: token }})
      } while (!!userWithThisToken);
  
      const authUser = await this.userRepository.findOne({ where: { login: user.login }})
      authUser.currentToken = token;
      await this.userRepository.save(authUser);
      
    } catch (error) {
      console.log('Error generateToken');
      console.log(error.message);
    }

    return token;
  }

  

  async login(loginData: LoginDataInterface, res: Response) {

    try {

      const user = await this.userRepository.findOne({
        where: { 
          login: loginData.login,
          password: hashPassword(loginData.password)
        }
      });

      if(!user) return res.status(404).json({ msg: "Invalid login or password" });

      const token = this.createToken( await this.generateToken(user));

      const authUser = await this.userRepository.findOne({
        where: { 
          login: loginData.login,
          password: hashPassword(loginData.password)
        }
      });

      const userResponse: UserResponseInterface = {
        name: authUser.name,
        currentToken: authUser.currentToken,
      }

      return res
        .status(200)
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: "localhost",
          httpOnly: true,
        })
        .json({
          ok: true,
          msg: "Logged in",
          data: userResponse
        });
      
    } catch (error) {
      console.log("Error login");
      console.log(error.message);
      return res.status(500).json({ msg: "Server error" });
    }
  }

  async logout(user: User, res: Response) {

    try {

      user.currentToken = null;
      await this.userRepository.save(user);

      res.clearCookie('jwt', {
        secure: false,
        domain: "localhost",
        httpOnly: true
      });

      return res.status(200).json({ ok: true, msg: "User logged out" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }
}

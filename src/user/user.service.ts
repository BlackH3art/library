import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { UserDataInterface, UserError, UserType } from 'src/interfaces/UserDataInterface';
import { hashPassword } from 'src/utils/hashPassword';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}


  private validate(data: UserDataInterface) {

    const error: UserError = {
      name: "",
      login: "",
      password: "",
      type: ""
    }

    if(data.name === "") error.name = "Name cannot be empty";
    if(data.login === "") error.login = "Login cannot be empty";
    if(data.password === "") error.password = "Password cannot be empty";
    if(data.type !== UserType.ADMIN && data.type !== UserType.USER) error.type = "Wrong user type";

    return error;
  }

  
  async register(userData: UserDataInterface, res: Response) {

    try {

      const dataError = this.validate(userData);
      if(dataError.name || dataError.login || dataError.password || dataError.type) {
        return res.status(400).json({ ok: false, msg: "Validation error", data: dataError });
      }
  
      const existingUser = await this.userRepository.findOne({ where: { login: userData.login} });
      if(existingUser) {
        return res.status(400).json({ ok: false, msg: "User already exist" });
      }
  
      const newUser = new User()
  
      newUser.name = userData.name;
      newUser.login = userData.login;
      newUser.password = hashPassword(userData.password);
      newUser.type = userData.type;
      await this.userRepository.save(newUser);
  
      return res.status(201).json({ ok: true, msg: "Created" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error" });
    }

  }
}

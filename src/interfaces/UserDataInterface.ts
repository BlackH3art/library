export interface UserDataInterface {
  name: string;
  login: string;
  password: string;
  type: UserType.ADMIN | UserType.USER;
}

export enum UserType {
  USER = "user",
  ADMIN = "admin",
}

export interface UserError {
  name: string;
  login: string;
  password: string;
  type: string;
}
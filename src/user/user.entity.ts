import { Book } from "src/book/book.entity";
import { UserType } from "src/interfaces/UserDataInterface";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  type: UserType.ADMIN | UserType.USER;

  @Column()
  currentToken: string;

  @OneToMany(() => Book, (book) => book.borrower)
  borrowedBooks: Book[];
}
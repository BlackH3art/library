import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ISBN: string;

  @Column()
  author: string;

  @Column()
  borrowed: boolean;

  @ManyToOne(() => User, (user) => user.borrowedBooks)
  borrower: User;

}
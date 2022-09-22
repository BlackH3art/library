import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
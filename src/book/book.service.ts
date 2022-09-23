import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { BookDataInterface, BookError } from 'src/interfaces/BookDataInterface';
import { UserType } from 'src/interfaces/UserDataInterface';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  private validate(data: BookDataInterface) {

    const error: BookError = {
      title: "",
      ISBN: "",
      author: ""
    }

    if(data.title === "") error.title = "Title cannot be empty";
    if(data.ISBN === "") error.ISBN = "ISBN cannot be empty";
    if(data.author === "") error.author = "Author cannot be empty";

    return error;
  }


  async getAll() {

    const books = await this.bookRepository.find();
    return books;
  }

  async getAllAvailable() {

    const books = await this.bookRepository.find({ where: { borrowed: false }});
    return books;
  }

  async addBook(bookData: BookDataInterface, user: User, res: Response) {

    try {

      if(user.type !== UserType.ADMIN) return res.status(403).json({ ok: false, msg: "Forbidden" });

      const dataError = this.validate(bookData);
      if(dataError.title || dataError.ISBN || dataError.author) {
        return res.status(400).json({ ok: false, msg: "Book validation error", data: dataError });
      }

      const newBook = new Book();
      newBook.name = bookData.title;
      newBook.ISBN = bookData.ISBN;
      newBook.author = bookData.author;
      newBook.borrowed = false;

      await this.bookRepository.save(newBook);

      return res.status(201).json({ ok: true, msg: "Created" });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }

  async deleteBook(id: string, user: User, res: Response) {

    try {

      if(user.type !== UserType.ADMIN) return res.status(403).json({ ok: false, msg: "Forbidden" });

      const book = await this.bookRepository.findOne({ where: { id: id}});
      if(!book) return res.status(404).json({ ok: false, msg: "Book doesn't exists" });


      await this.bookRepository.delete(id);

      return res.status(200).json({ ok: true, msg: "Deleted" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }

  async editBook(id: string, bookData: BookDataInterface, user: User, res: Response) {

    try {

      if(user.type !== UserType.ADMIN) return res.status(403).json({ ok: false, msg: "Forbidden" });

      const dataError = this.validate(bookData);
      if(dataError.title || dataError.ISBN || dataError.author) {
        return res.status(400).json({ ok: false, msg: "Book validation error", data: dataError });
      }

      const book = await this.bookRepository.findOne({ where: { id: id }});
      if(!book) return res.status(404).json({ ok: false, msg: "Book doesn't exists" });

      book.name = bookData.title;
      book.ISBN = bookData.ISBN;
      book.author = bookData.author;
      await this.bookRepository.save(book);

      return res.status(200).json({ ok: true, msg: "Book updated" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }

  async borrowBook(id: string, user: User, res: Response) {

    try {
      
      if(user.type !== UserType.USER) return res.status(403).json({ ok: false, msg: "Forbidden" });
  
      const book = await this.bookRepository.findOne({ where: { id: id }});
      if(!book) return res.status(404).json({ ok: false, msg: "Book doesn't exists" });
      if(book.borrowed) return res.status(405).json({ ok: false, msg: "Book is already borrowed" });
  
      book.borrowed = true;
      book.borrower = user;
  
      await this.bookRepository.save(book);
  
      return res.status(200).json({ ok: true, msg: "Book borrowed" });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }

  async returnBook(id: string, user: User, res: Response) {

    try {

      if(user.type !== UserType.USER) return res.status(403).json({ ok: false, msg: "Forbidden" });
  
      const book = await this.bookRepository.findOne({ where: { id: id }, relations: { borrower: true }});
      if(!book) return res.status(400).json({ ok: false, msg: "Book doesn't exists" });
      if(!book.borrowed) return res.status(405).json({ ok: false, msg: "Book isn't borrowed" });
      if(user.id !== book.borrower.id) return res.status(405).json({ ok: false, msg: "You can't return book which you didn't borrow" });
  
      book.borrowed = false;
      book.borrower = null;
      
      await this.bookRepository.save(book);
  
      return res.status(200).json({ ok: true, msg: "Book returned" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, msg: "Server error" });
    }
  }
}

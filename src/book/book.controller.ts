import { Body, Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/UserDecorator';
import { BookDataInterface } from 'src/interfaces/BookDataInterface';
import { User } from 'src/user/user.entity';
import { Book } from './book.entity';
import { BookService } from './book.service';

@Controller('book')
export class BookController {

  constructor(
    @Inject(BookService) private bookService: BookService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAll(): Promise<Book[]> {
    return this.bookService.getAll();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllAvailable(): Promise<Book[]> {
    return this.bookService.getAllAvailable();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  addBook(
    @Body() bookData: BookDataInterface,
    @UserDecorator() user: User,
    @Res() res: Response
  ): Promise<any> {
    console.log('user in ctrl --> ', user);
    
    return this.bookService.addBook(bookData, user, res);
  }
}

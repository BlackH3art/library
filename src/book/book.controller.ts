import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookDataInterface } from 'src/interfaces/BookDataInterface';
import { BookService } from './book.service';

@Controller('book')
export class BookController {

  constructor(
    @Inject(BookService) private bookService: BookService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAll(): Promise<BookDataInterface[]> {
    return this.bookService.getAll();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllAvailable(): Promise<BookDataInterface[]> {
    return this.bookService.getAllAvailable();
  }
}

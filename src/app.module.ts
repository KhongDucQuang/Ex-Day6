import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Books } from './books/books.controller';

@Module({
  imports: [],
  controllers: [AppController, Books],
  providers: [AppService],
})
export class AppModule {}

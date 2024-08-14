import { Test, TestingModule } from '@nestjs/testing';
import { Books } from './books.controller';

describe('BooksController', () => {
  let controller: Books;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Books],
    }).compile();

    controller = module.get<Books>(Books);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Controller, Get, Param, Post, Delete, Body, Put, NotFoundException } from '@nestjs/common';
import { Book } from './book.model';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { json } from 'stream/consumers';

const BOOKS_FILE = join(__dirname, '..', '..', 'src', 'books', 'books.json');


@Controller('books')
export class Books {
    
    @Get()
    getAllBooks(): string {
        const listBooks = readFileSync(BOOKS_FILE, 'utf-8')
        return JSON.parse(listBooks);
    }

    @Get(':id')
    getBookById(@Param('id') id: string): string {
        const listBooks = JSON.parse(readFileSync(BOOKS_FILE, 'utf-8'));
        const returnBook = listBooks.findIndex(book => book.id === id);
        if(returnBook === -1){
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        
        return JSON.parse(JSON.stringify(listBooks[returnBook], null, '\t'));
    }
    
    @Post()
    addBook(@Body() newBook: Book): string {
        const listBooks: Book[] = JSON.parse(readFileSync(BOOKS_FILE, 'utf-8'));
        const checkExist = listBooks.some(book => book.title === newBook.title
                                           && book.author === newBook.author
                                           && book.publishedYear === newBook.publishedYear
                                           && book.id === newBook.id
        )
        if(checkExist){
            return 'Book already existed!';
        }
        listBooks.push({...newBook});
        const data = JSON.stringify(listBooks, null, 2);
        try{
            writeFileSync(BOOKS_FILE, data, 'utf-8');
            return "Da them sach moi thanh cong!";
        } catch (err) {
            return "Da co loi xay ra";
        }
    }
    
    @Put(':id')
    updateBook(
        @Param('id') id: string,
        @Body() updatedBook: Partial<Book>
    ) : string {
        try {
            const listBooks = JSON.parse(readFileSync(BOOKS_FILE, 'utf-8'));
            const bookIndex = listBooks.findIndex(book => book.id === id);
            if (bookIndex > -1) {
                listBooks[bookIndex] = { ...listBooks[bookIndex], ...updatedBook };
                const data = JSON.stringify(listBooks, null, 2);
                writeFileSync(BOOKS_FILE, data, 'utf-8');
                return `Cap nhat sach co so thu tu ${id} thanh cong!`;
            }
            return `Khong tim thay cuon sach co ID: ${id}`;
        } catch (err) {
            console.error('Loi xay ra khi cap nhat sach', err);
            return 'Da co loi xay ra';
        }
    }
    
    @Delete(':id')
    deleteBook(@Param('id') id: string): string {
        try {
            const listBooks = JSON.parse(readFileSync(BOOKS_FILE, 'utf-8'));
            const bookIndex = listBooks.findIndex(book => book.id === id);
            if(bookIndex > -1) {
                listBooks.splice(bookIndex, 1);
                const data = JSON.stringify(listBooks, null, 2);
                writeFileSync(BOOKS_FILE, data, 'utf-8');
                return `Xoa cuon sach co so thu tu ${id} thanh cong!`;
            }
            return `Khong tim thay cuon sach co ID: ${id}`;
        } catch (err){
            console.error('Loi xoa sach:', err);
            return 'Da co loi xay ra';
        }
    }
}

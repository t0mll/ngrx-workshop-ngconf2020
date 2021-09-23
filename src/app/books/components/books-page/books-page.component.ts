import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  BookModel,
  calculateBooksGrossEarnings,
  BookRequiredProps,
} from 'src/app/shared/models';
import { BooksService } from 'src/app/shared/services';
import {
  selectActiveBook,
  selectAllbooks,
  selectBooksEarningsTotal,
  State,
} from 'src/app/shared/state';
import { BooksPageActions, BooksApiActions } from '../../actions';

@Component({
  selector: 'app-books',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.css'],
})
export class BooksPageComponent implements OnInit {
  books$: Observable<BookModel[]>;
  currentBook$: Observable<BookModel | undefined>;
  total$: Observable<number>;

  constructor(private booksService: BooksService, private store: Store<State>) {
    this.total$ = store.select(selectBooksEarningsTotal);
    this.currentBook$ = store.select(selectActiveBook);
    this.books$ = store.select(selectAllbooks);
  }

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enter());

    this.getBooks();
    this.removeSelectedBook();
  }

  getBooks() {
    this.booksService.all().subscribe((books) => {
      this.store.dispatch(BooksApiActions.booksLoaded({ books: books }));
    });
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ('id' in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BooksPageActions.createBook({ book: bookProps }));
    this.booksService.create(bookProps).subscribe((book) => {
      this.store.dispatch(BooksApiActions.bookCreated({ book }));
      this.getBooks();
      this.removeSelectedBook();
    });
  }

  updateBook(book: BookModel) {
    this.store.dispatch(
      BooksPageActions.updateBook({ bookId: book.id, changes: book })
    );
    this.booksService.update(book.id, book).subscribe((book) => {
      this.store.dispatch(BooksApiActions.bookUpdated({ book }));
      this.getBooks();
      this.removeSelectedBook();
    });
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({ bookId: book.id }));
    this.booksService.delete(book.id).subscribe(() => {
      this.store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }));
      this.getBooks();
      this.removeSelectedBook();
    });
  }
}

import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { BookModel, calculateBooksGrossEarnings } from 'src/app/shared/models';
import { BooksPageActions, BooksApiActions } from 'src/app/books/actions';

const createBook = (books: BookModel[], book: BookModel) => [...books, book];

const updateBook = (books: BookModel[], changes: BookModel) =>
  books.map((book) => {
    return book.id === changes.id ? Object.assign({}, book, changes) : book;
  });

const deleteBook = (books: BookModel[], bookId: string) =>
  books.filter((book) => bookId !== book.id);

export interface State {
  collection: BookModel[];
  selectedBookId: string | null;
}
 
export const initialState: State = {
  collection: [],
  selectedBookId: null,
};

export const booksReducer = createReducer(
  initialState,
  on(BooksPageActions.enter, BooksPageActions.clearSelectedBook, (state) => {
    return {
      ...state,
      selectedBookId: null,
    };
  }),
  on(BooksPageActions.selectBook, (state, action) => {
    return {
      ...state,
      selectedBookId: action.bookId,
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return booksReducer(state, action);
}
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, exhaustMap, mergeMap, concatMap } from 'rxjs/operators';
import { BooksService } from '../shared/services';
import { BooksPageActions, BooksApiActions } from './actions';

@Injectable()
export class BooksApiEffects {
  constructor(private booksService: BooksService, private actions$: Actions) {}

  loadBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.enter),
      exhaustMap(() => {
        return this.booksService
          .all()
          .pipe(map((books) => BooksApiActions.booksLoaded({ books })));
      })
    );
  });

  deleteBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.deleteBook),
      mergeMap((action) => {
        return this.booksService
          .delete(action.bookId)
          .pipe(
            map(() => BooksApiActions.bookDeleted({ bookId: action.bookId }))
          );
      })
    );
  });

  createBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.createBook),
      concatMap((action) => {
        return this.booksService
          .create(action.book)
          .pipe(map((book) => BooksApiActions.bookCreated({ book })));
      })
    );
  });

  updateBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BooksPageActions.updateBook),
      concatMap(({ bookId, changes }) => {
        return this.booksService
          .update(bookId, changes)
          .pipe(map((book) => BooksApiActions.bookCreated({ book })));
      })
    );
  });
}

import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs/operators';
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
}

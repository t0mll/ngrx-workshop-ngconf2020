import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { BookModel, calculateBooksGrossEarnings } from 'src/app/shared/models';
import { BooksPageActions, BooksApiActions } from 'src/app/books/actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface State extends EntityState<BookModel> {
  selectedBookId: string | null;
}

const adapter = createEntityAdapter<BookModel>();

export const initialState: State = adapter.getInitialState({
  selectedBookId: null,
});

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
  }),
  on(BooksApiActions.booksLoaded, (state, action) => {
    return adapter.addMany(action.books, state);
  }),
  on(BooksApiActions.bookCreated, (state, action) => {
    return adapter.addOne(action.book, {
      ...state,
      selectedBookId: null,
    });
  }),
  on(BooksApiActions.bookUpdated, (state, action) => {
    return adapter.updateOne(
      { id: action.book.id, changes: action.book },
      {
        ...state,
        selectedBookId: null,
      }
    );
  }),
  on(BooksApiActions.bookDeleted, (state, action) => {
    return adapter.removeOne(action.bookId, state);
  })
);

export function reducer(state: State | undefined, action: Action) {
  return booksReducer(state, action);
}

export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectSelectedBookId = (state: State) => state.selectedBookId;

export const selectActiveBook = createSelector(
  selectEntities,
  selectSelectedBookId,
  (entities, selectedBookdId) => {
    return selectedBookdId ? entities[selectedBookdId] : null;
  }
);

export const selectEarningsTotal = createSelector(
  selectAll,
  calculateBooksGrossEarnings
);

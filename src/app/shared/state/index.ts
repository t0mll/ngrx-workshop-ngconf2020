import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import * as fromBooks from './books.reducer';

export interface State {
  books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  books: fromBooks.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];

/**
 * Books
 */
export const selectBooksState = (state: State) => state.books;

export const selectActiveBook = createSelector(
  selectBooksState,
  fromBooks.selectActiveBook
);

export const selectAllbooks = createSelector(
  selectBooksState,
  fromBooks.selectAll
);

export const selectBooksEarningsTotal = createSelector(
  selectBooksState,
  fromBooks.selectEarningsTotal
);

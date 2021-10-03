import { UserModel } from '../models';
import { Action, createReducer, on } from '@ngrx/store';
import { AuthApiActions, AuthUserActions } from 'src/app/auth/actions';

export interface State {
  gettingStatus: boolean;
  user: UserModel | null;
  error: string | null;
}

export const initialState: State = {
  gettingStatus: true,
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthUserActions.login, (state, action) => {
    return {
      ...state,
      gettingStatus: true,
      user: null,
      error: null,
    };
  }),
  on(AuthUserActions.logout, (state, action) => {
    return {
        ...state,
      gettingStatus: false,
      user: null,
      error: null,
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}

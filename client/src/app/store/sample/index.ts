import { ActionReducerMap } from '@ngrx/store';
import * as fromTodo from './reducer';

/**
 * アプリ全体の状態
 */
export interface State {
  todo: fromTodo.State;  // createFeatureSelectorで指定したものと同じ名前にすること
}

/**
 * アプリ全体のStoreとReducerの関連付け
 */
export const reducers: ActionReducerMap<State> = {
  todo: fromTodo.reducer,
};

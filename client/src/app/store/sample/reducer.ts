import { Action, createSelector, createFeatureSelector } from '@ngrx/store';
import * as TodoAction from './actions';
import { Todo } from './todo';

/**
 * 状態
 */
export interface State {
  loading: boolean;
  todos: Todo[];
}

/**
 * 初期状態
 */
export const initialState = {
  loading: false,
  todos: [],
};

/**
 * Reducer
 */
export function reducer(state = initialState, action: TodoAction.Actions): State {
  switch (action.type) {
    case TodoAction.CREATE: {
      // 作成
      return Object.assign({}, state, { loading: true });
    }
    case TodoAction.CREATE_SUCCESS: {
      // 作成成功したら一覧に追加
      return Object.assign({}, state, { loading: false, todos: [...state.todos, action.payload] });
    }
    case TodoAction.CREATE_FAILURE: {
      // 作成失敗
      return Object.assign({}, state, { loading: false });
    }
    default: {
      return state;
    }
  }
}

/**
 * セレクタ（Storeから特定の状態を取得する）
 */
export const getState = createFeatureSelector<State>('todo');
export const getLoading = createSelector(getState, state => state.loading);
export const getTodos = createSelector(getState, state => state.todos);
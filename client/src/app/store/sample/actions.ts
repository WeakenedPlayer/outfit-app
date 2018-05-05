import { Action } from '@ngrx/store';
import { Todo } from '../todo';

export const CREATE         = '[Todo] Create';
export const CREATE_SUCCESS = '[Todo] Create Success';
export const CREATE_FAILURE = '[Todo] Create Failure';

/**
 * 作成
 */
export class Create implements Action {
  readonly type = CREATE;
  constructor(public payload: Todo) {}
}

/**
 * 作成成功
 */
export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;
  constructor(public payload: Todo) {}
}

/**
 * 作成失敗
 */
export class CreateFailure implements Action {
  readonly type = CREATE_FAILURE;
  constructor(public payload?: any) {}
}

export type Actions = Create | CreateSuccess | CreateFailure;

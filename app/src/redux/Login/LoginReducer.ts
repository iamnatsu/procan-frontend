import { Reducer } from 'redux';

import Store from './LoginStore';
import { ActionType } from '../ActionType';

export const LoginReducer: Reducer<Store> = (state = new Store(), action: any) => {
  switch (action.type) {
    case ActionType.LoginUpdateLoginUser:
      return state.setLoginUser(action.user);
    case ActionType.LoginSetErrorMessage:
      return state.setErrorMessage(action.errorMessage);
    case ActionType.LoginDestory:
      return new Store();
    default:
      return state;
  }
}
export type LoginState = Store;

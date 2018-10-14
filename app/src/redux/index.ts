import { combineReducers, applyMiddleware } from 'redux';

import { LoginReducer, LoginState } from './Login/LoginReducer';
import { MessageDialogReducer, MessageDialogState } from './component/MessageDialog/MessageDialogReducer';

export interface AppComponentState {
  messageDialog: MessageDialogState,
}
const component = combineReducers<AppComponentState>({
  messageDialog: MessageDialogReducer,
});

export interface AppState {
  component: AppComponentState;
  login: LoginState;
}

// container
export const reducers = combineReducers<AppState>({
  login: LoginReducer,
  component: component,
});

export const middlewares = applyMiddleware(...[
]);

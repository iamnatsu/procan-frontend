import { combineReducers, applyMiddleware } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import { LoginReducer, LoginState } from './Login/LoginReducer';
import { DashBoardReducer, DashBoardState } from './DashBoard/DashBoardReducer';
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
  dashboard: DashBoardState;
  form: any
}

// container
export const reducers = combineReducers<AppState>({
  login: LoginReducer,
  dashboard: DashBoardReducer,
  component: component,
  form: reduxFormReducer,
});

export const middlewares = applyMiddleware(...[
]);

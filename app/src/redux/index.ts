import { combineReducers, applyMiddleware } from 'redux';
//import { reducer as reduxFormReducer } from 'redux-form';
//import { routerReducer, RouterState, routerMiddleware } from 'react-router-redux';

import { LoginReducer, LoginState } from './Login/LoginReducer';

/*
export interface AppComponentState {
  messageModal: MessageModalState,
  snackbar: GlobalSnackbarState,
}
const component = combineReducers<AppComponentState>({
  messageModal: MessageModalReducer,
  snackbar: GlobalSnackbarReducer
});
*/

export interface AppState {
  //component: AppComponentState;
  login: LoginState;
}

// container
export const reducers = combineReducers<AppState>({
  login: LoginReducer,
});

export const middlewares = applyMiddleware(...[
]);

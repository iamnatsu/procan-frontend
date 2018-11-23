import { combineReducers, applyMiddleware } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import { LoginReducer, LoginState } from './Login/LoginReducer';
import { DashBoardReducer, DashBoardState } from './DashBoard/DashBoardReducer';
import { MessageDialogReducer, MessageDialogState } from './component/MessageDialog/MessageDialogReducer';
import { TaskFormReducer, TaskFormState } from './component/TaskForm/TaskFormReducer';
import { ProjectState, ProjectReducer } from './Project/ProjectReducer';

export interface AppComponentState {
  messageDialog: MessageDialogState,
  taskForm: TaskFormState,
}
const component = combineReducers<AppComponentState>({
  messageDialog: MessageDialogReducer,
  taskForm: TaskFormReducer,
});

export interface AppState {
  component: AppComponentState;
  login: LoginState;
  dashboard: DashBoardState;
  project: ProjectState;
  form: any
}

// container
export const reducers = combineReducers<AppState>({
  component: component,
  login: LoginReducer,
  dashboard: DashBoardReducer,
  project: ProjectReducer,
  form: reduxFormReducer,
});

export const middlewares = applyMiddleware(...[
]);

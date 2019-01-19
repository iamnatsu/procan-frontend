import { combineReducers, applyMiddleware } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import { LoginReducer, LoginState } from './Login/LoginReducer';
import { DashBoardReducer, DashBoardState } from './DashBoard/DashBoardReducer';
import { MessageDialogReducer, MessageDialogState } from './component/MessageDialog/MessageDialogReducer';
import { UserSelectorReducer, UserSelectorState } from './component/UserSelector/UserSelectorReducer';
import { UserCardReducer, UserCardState } from './component/UserCard/UserCardReducer';
import { TaskFormReducer, TaskFormState } from './component/TaskForm/TaskFormReducer';
import { AppBarReducer, AppBarState } from './component/AppBar/AppBarReducer';
import { ProjectState, ProjectReducer } from './Project/ProjectReducer';
import { ProfileState, ProfileReducer } from './Profile/ProfileReducer';

export interface AppComponentState {
  messageDialog: MessageDialogState,
  userSelector: UserSelectorState,
  userCard: UserCardState,
  taskForm: TaskFormState,
  appBar: AppBarState
}
const component = combineReducers<AppComponentState>({
  messageDialog: MessageDialogReducer,
  userSelector: UserSelectorReducer,
  userCard: UserCardReducer,
  taskForm: TaskFormReducer,
  appBar: AppBarReducer
});

export interface AppState {
  component: AppComponentState;
  login: LoginState;
  dashboard: DashBoardState;
  project: ProjectState;
  profile: ProfileState;
  form: any
}

// container
export const reducers = combineReducers<AppState>({
  component: component,
  login: LoginReducer,
  dashboard: DashBoardReducer,
  project: ProjectReducer,
  profile: ProfileReducer,
  form: reduxFormReducer,
});

export const middlewares = applyMiddleware(...[
]);

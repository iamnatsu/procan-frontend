import { Reducer } from 'redux';

import Store from './ProjectStore';
import { ActionType } from 'src/redux/ActionType';

export const ProjectReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.ProjectIsShowProjectModal:
      return state.setIsShowProjectModal(action.isShow);
    case ActionType.ProjectUpdateProject:
      return state.setProject(action.project);
    case ActionType.ProjectUpdateTasks:
      return state.setTasks(action.projects);
    default:
      return state;
  }
}
export type ProjectState = Store;

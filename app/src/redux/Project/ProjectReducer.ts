import { Reducer } from 'redux';

import Store from './ProjectStore';
import { ActionType } from 'src/redux/ActionType';

export const ProjectReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.ProjectIsShowProjectModal:
      return state.setIsShowProjectModal(action.isShow);
    case ActionType.ProjectIsShowTaskModal:
      return state.setIsShowTaskModal(action.isShow);
    case ActionType.ProjectUpdateProject:
      return state.setProject(action.project);
    case ActionType.ProjectLoadTasks:
        return state.initTasks(action.tasks);
    case ActionType.ProjectUpdateTasks:
        return state.setTasks(action.tasks);
    case ActionType.ProjectAddTask:
      return state.addTask(action.task);
    default:
      return state;
  }
}
export type ProjectState = Store;

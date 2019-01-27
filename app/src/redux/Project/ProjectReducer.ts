import { Reducer } from 'redux';

import Store from './ProjectStore';
import { ActionType } from 'src/redux/ActionType';

export const ProjectReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.ProjectIsShowProjectModal:
      return state.setIsShowProjectModal(action.isShow);
    case ActionType.ProjectIsShowTaskModal:
      return state.setIsShowTaskModal(action.isShow);
    case ActionType.ProjectUpdateMenuAnchor:
      return state.setMenuAnchor(action.anchor, action.pos);
    case ActionType.ProjectUpdateProject:
      return state.setProject(action.project);
    case ActionType.ProjectLoadTasks:
        return state.initTasks(action.tasks);
    case ActionType.ProjectUpdateTasks:
        return state.setTasks(action.tasks);
    case ActionType.ProjectUpdateTask:
        return state.updateTask(action.task);
    case ActionType.ProjectAddTask:
      return state.addTask(action.task);
    case ActionType.ProjectChangeView:
      return state.setViewMode(action.viewMode)
    case ActionType.ProjectShowPopOver:
      return state.setPopOver(action.target, action.anchor, action.value, action.action)
    case ActionType.ProjectUpdatePopOverValue:
      return state.setPopOverValue(action.value)
    default:
      return state;
  }
}
export type ProjectState = Store;

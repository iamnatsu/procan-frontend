import { Reducer } from 'redux';

import Store from './DashBoardStore';
import { ActionType } from 'src/redux/ActionType';

export const DashBoardReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.DashBoardIsShowProjectModal:
      return state.setIsShowProjectModal(action.isShow);
    case ActionType.DashBoardIsShowGroupModal:
      return state.setIsShowGroupModal(action.isShow);
    case ActionType.DashBoardUpdateProject:
      return state.setProject(action.project);
    case ActionType.DashBoardUpdateProjects:
      return state.setProjects(action.projects);
    case ActionType.DashBoardUpdateGroup:
      return state.setGroup(action.group);
    case ActionType.DashBoardUpdateGroups:
      return state.setGroups(action.groups);
      default:
      return state;
  }
}
export type DashBoardState = Store;

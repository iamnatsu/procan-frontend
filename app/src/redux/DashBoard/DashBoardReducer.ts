import { Reducer } from 'redux';

import Store from './DashBoardStore';
import { ActionType } from 'src/redux/ActionType';

export const DashBoardReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.DashBoardIsShowProjectModal:
      return state.setIsShowProjectModal(action.isShow);
    case ActionType.DashBoardUpdateProject:
      return state.setProject(action.project);
    case ActionType.DashBoardUpdateProjects:
      return state.setProjects(action.projects);
    default:
      return state;
  }
}
export type DashBoardState = Store;

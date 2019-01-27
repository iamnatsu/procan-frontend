import { Reducer } from 'redux';

import Store from './GanttStore';
import { ActionType } from 'src/redux/ActionType';

export const GanttReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.GanttUpdateScrollLeft:
      return state.setLeft(action.left);
    case ActionType.GanttUpdateWidth:
      return state.setWidth(action.width);
    case ActionType.GanttUpdateStartDay:
      return state.setStartDay(action.date);
    case ActionType.GanttUpdateWidthAndStartDay:
      return state.setWidthAndStartDay(action.width, action.date)
    default:
      return state;
  }
}
export type GanttState = Store;

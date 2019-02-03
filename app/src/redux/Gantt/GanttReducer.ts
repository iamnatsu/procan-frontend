import { Reducer } from 'redux';

import Store from './GanttStore';
import { ActionType } from 'src/redux/ActionType';

export const GanttReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.GanttUpdateScrollLeft:
      return state.setLeft(action.left);
    case ActionType.GanttUpdateScrollTop:
      return state.setTop(action.top);
    case ActionType.GanttUpdateScrollCoord:
      return state.setCoord(action.left, action.top);
    case ActionType.GanttUpdateWidth:
      return state.setWidth(action.width);
    case ActionType.GanttUpdateStartDay:
      return state.setStartDay(action.date);
    case ActionType.GanttUpdateWidthAndStartDay:
      return state.setWidthAndStartDay(action.width, action.date)
    case ActionType.GanttUpdateHeaders:
      return state.setHeaders(action.headers)
    case ActionType.GanttUpdateSettingAnchor:
      return state.setSettingAnchor(action.anchor)
    default:
      return state;
  }
}
export type GanttState = Store;

import { Reducer } from 'redux';

import Store from './MessageDialogStore';
import { ActionType } from 'src/redux/ActionType';

export const MessageDialogReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.MessageDialogUpdateAction:
      return state.setModal(action.isShow, action.title, action.message, action.action, action.actionMap);
    case ActionType.MessageDialogUpdateIsShowAction:
      return state.setIsShow(action.isShow);
      /*
    case ActionType.ComponentConfirmModalUpdateAction:
      return state.setConfirmModal(action.isShow, action.title, action.message, action.action);
    case ActionType.ComponentConfirmModalUpdateIsShowAction:
      return state.setConfirmIsShow(action.isShow);
  */
    default:
      return state;
  }
}
export type MessageDialogState = Store;

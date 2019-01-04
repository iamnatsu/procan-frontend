import { Reducer } from 'redux';

import Store from './UserCardStore';
import { ActionType } from 'src/redux/ActionType';

export const UserCardReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.UserCardUpdateIsShowAction:
      return state.setShow(action.isShow, action.anchorEl, action.user, action.onDelete);
    default:
      return state;
  }
}
export type UserCardState = Store;

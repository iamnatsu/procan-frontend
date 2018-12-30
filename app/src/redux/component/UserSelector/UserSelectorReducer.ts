import { Reducer } from 'redux';

import Store from './UserSelectorStore';
import { ActionType } from 'src/redux/ActionType';

export const UserSelectorReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.UserSelectorUpdateIsShowAction:
      return state.setShow(action.isShow, action.anchorEl, action.onSubmit);
    case ActionType.UserSelectorUpdateCandidates:
      return state.setCandidates(action.candidates);
    case ActionType.UserSelectorUpdateSelections:
      return state.setSelections(action.selections);
    default:
      return state;
  }
}
export type UserSelectorState = Store;

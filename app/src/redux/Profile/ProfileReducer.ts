import { Reducer } from 'redux';

import Store from './ProfileStore';
import { ActionType } from 'src/redux/ActionType';

export const ProfileReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.ProfileUpdateUser:
      return state.setUser(action.user);
    default:
      return state;
  }
}
export type ProfileState = Store;

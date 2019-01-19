import { Reducer } from 'redux';

import Store from './AppBarStore';
import { ActionType } from 'src/redux/ActionType';

export const AppBarReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.AppBarUpdateConfig:
      return state.setConfig(action.config);
    default:
      return state;
  }
}
export type AppBarState = Store;

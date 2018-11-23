import { Reducer } from 'redux';

import Store from './TaskFormStore';
import { ActionType } from 'src/redux/ActionType';

export const TaskFormReducer: Reducer<Store> = (state = new Store(), action) => {
  switch (action.type) {
    case ActionType.TaskFormUpdateTask:
      return state.setTask(action.task);
    default:
      return state;
  }
}
export type TaskFormState = Store;

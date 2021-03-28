import { TaskFormUpdateTask  } from './TaskFormActionCreator';
import { Task } from '../../../model/task';

export class TaskFormDispatchFunctions {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  updateTask(task: Task) {
    this.dispatch(TaskFormUpdateTask(task));
  }
}

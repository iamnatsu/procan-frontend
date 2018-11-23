import { TaskFormUpdateTask  } from './TaskFormActionCreator';
import { Task } from '../../../model/task';

export class TaskFormDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  updateTask(task: Task) {
    this.dispatch(TaskFormUpdateTask(task));
  }
}

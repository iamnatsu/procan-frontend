import { Record, Map } from 'immutable';
import { Task } from '../../../model/task';

const MessageDialogRecord = Record({ isShow: false,  task: Map() });

export default class MessageDialogStore extends MessageDialogRecord {

  /*
  isShow() {
    return this.get('isShow');
  }

  setIsShow(isShow: boolean): this {
    return this.set('isShow', isShow) as this;
  }*/

  getTask() {
    return this.get('task');
  }

  setTask(task: Task): this {
    return this.set('task', Map(task)) as this;
  }

}

import { ActionType } from '../../ActionType';
import { Task } from '../../../model/task';

export const TaskFormUpdateTask = (task: Task) => ({ type: ActionType.TaskFormUpdateTask, task });
// export const TaskFormUpdateIsShowAction = (isShow: boolean) => ({ type: ActionType.TaskFormUpdateIsShowAction, isShow });


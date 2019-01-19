import { ActionType } from '../ActionType';
import { Project } from '../../model/project';
import { Task } from '../../model/task';

export const ProjectIsShowProjectModal = (isShow: boolean) => ({ type: ActionType.ProjectIsShowProjectModal, isShow });
export const ProjectIsShowTaskModal = (isShow: boolean) => ({ type: ActionType.ProjectIsShowTaskModal, isShow });
export const ProjectUpdateProject = (project: Project) => ({ type: ActionType.ProjectUpdateProject, project });
export const ProjectLoadTasks = (tasks: Array<Task>) => ({ type: ActionType.ProjectLoadTasks, tasks });
export const ProjectUpdateTasks = (tasks: Array<Task>) => ({ type: ActionType.ProjectUpdateTasks, tasks });
export const ProjectUpdateTask = (task: Task) => ({ type: ActionType.ProjectUpdateTask, task });
export const ProjectAddTask = (task: Task) => ({ type: ActionType.ProjectAddTask, task });
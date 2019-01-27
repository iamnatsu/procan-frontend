import { ActionType } from '../ActionType';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { ViewMode, PopOverTarget } from '../../model/common';

export const ProjectIsShowProjectModal = (isShow: boolean) => ({ type: ActionType.ProjectIsShowProjectModal, isShow });
export const ProjectIsShowTaskModal = (isShow: boolean) => ({ type: ActionType.ProjectIsShowTaskModal, isShow });
export const ProjectUpdateMenuAnchor = (anchor?: HTMLElement, pos?: number) => ({ type: ActionType.ProjectUpdateMenuAnchor, anchor, pos });
export const ProjectUpdateProject = (project: Project) => ({ type: ActionType.ProjectUpdateProject, project });
export const ProjectLoadTasks = (tasks: Array<Task>) => ({ type: ActionType.ProjectLoadTasks, tasks });
export const ProjectUpdateTasks = (tasks: Array<Task>) => ({ type: ActionType.ProjectUpdateTasks, tasks });
export const ProjectUpdateTask = (task: Task) => ({ type: ActionType.ProjectUpdateTask, task });
export const ProjectAddTask = (task: Task) => ({ type: ActionType.ProjectAddTask, task });
export const ProjectChangeView = (viewMode: ViewMode) => ({ type: ActionType.ProjectChangeView, viewMode });
export const ProjectShowPopOver = (target?: PopOverTarget, anchor?: HTMLElement, value?: string, action?: (value: string) => void) => 
    ({ type: ActionType.ProjectShowPopOver, target, anchor, value, action });
export const ProjectUpdatePopOverValue = (value: string) => ({ type: ActionType.ProjectUpdatePopOverValue, value });
import { ActionType } from '../ActionType';
import { Project } from '../../model/project';

export const ProjectIsShowProjectModal = (isShow: boolean) => ({ type: ActionType.DashBoardIsShowProjectModal, isShow });
export const ProjectUpdateProject = (project: Project) => ({ type: ActionType.DashBoardUpdateProject, project });
export const ProjectUpdateTasks = (projects: Array<Project>) => ({ type: ActionType.DashBoardUpdateProjects, projects });

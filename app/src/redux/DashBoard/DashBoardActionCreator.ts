import { ActionType } from '../ActionType';
import { Project } from '../../model/project';

export const DashBoardIsShowProjectModal = (isShow: boolean) => ({ type: ActionType.DashBoardIsShowProjectModal, isShow });
export const DashBoardUpdateProject = (project: Project) => ({ type: ActionType.DashBoardUpdateProject, project });
export const DashBoardUpdateProjects = (projects: Array<Project>) => ({ type: ActionType.DashBoardUpdateProjects, projects });

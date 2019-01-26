import { ActionType } from '../ActionType';
import { Project } from '../../model/project';
import { Group } from '../../model/group';

export const DashBoardIsShowProjectModal = (isShow: boolean) => ({ type: ActionType.DashBoardIsShowProjectModal, isShow });
export const DashBoardIsShowGroupModal = (isShow: boolean) => ({ type: ActionType.DashBoardIsShowGroupModal, isShow });
export const DashBoardUpdateProject = (project: Project) => ({ type: ActionType.DashBoardUpdateProject, project });
export const DashBoardUpdateProjects = (projects: Array<Project>) => ({ type: ActionType.DashBoardUpdateProjects, projects });
export const DashBoardUpdateGroup = (group: Group) => ({ type: ActionType.DashBoardUpdateGroup, group });
export const DashBoardUpdateGroups = (groups: Array<Group>) => ({ type: ActionType.DashBoardUpdateGroups, groups });

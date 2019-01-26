import { DashBoardIsShowProjectModal, DashBoardIsShowGroupModal, DashBoardUpdateProject, DashBoardUpdateProjects, DashBoardUpdateGroup, DashBoardUpdateGroups } from './DashBoardActionCreator';
import { Project } from '../../model/project';
import { Group } from '../../model/group';
import * as ProjectService from '../../service/ProjectService';
import * as GroupService from '../../service/GroupService';

export class DashBoardDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  loadProjects() {
    ProjectService.find().then(result => {
      this.dispatch(DashBoardUpdateProjects(result.data));
    });
  }

  loadGroups() {
    GroupService.find().then(result => {
      this.dispatch(DashBoardUpdateGroups(result.data));
    });
  }
  
  showProjectModal() {
    this.dispatch(DashBoardIsShowProjectModal(true));
  }

  closeProjectModal() {
    this.dispatch(DashBoardIsShowProjectModal(false));
  }
  
  showGroupModal() {
    this.dispatch(DashBoardIsShowGroupModal(true));
  }

  closeGroupModal() {
    this.dispatch(DashBoardIsShowGroupModal(false));
  }

  updateProject(project: Project) {
    this.dispatch(DashBoardUpdateProject(project));
  }

  updateProjects(projects: Project[]) {
    this.dispatch(DashBoardUpdateProjects(projects));
  }

  updateGroup(group: Group) {
    this.dispatch(DashBoardUpdateGroup(group));
  }

  updateGroups(groups: Array<Group>) {
    this.dispatch(DashBoardUpdateGroups(groups));
  }

}

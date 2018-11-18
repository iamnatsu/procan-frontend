import { DashBoardIsShowProjectModal, DashBoardUpdateProject, DashBoardUpdateProjects } from './DashBoardActionCreator';
import { Project } from '../../model/project';
import * as ProjectService from '../../service/ProjectService';

export class DashBoardDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  loadProjects() {
    ProjectService.find().then(result => {
      this.dispatch(DashBoardUpdateProjects(result.data));
    });
  }
  
  showProjectModal() {
    this.dispatch(DashBoardIsShowProjectModal(true));
  }

  closeProjectModal() {
    this.dispatch(DashBoardIsShowProjectModal(false));
  }

  updateProject(project: Project) {
    this.dispatch(DashBoardUpdateProject(project));
  }

}

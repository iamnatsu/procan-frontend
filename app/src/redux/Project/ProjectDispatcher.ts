import { ProjectIsShowProjectModal, ProjectUpdateProject, ProjectUpdateTasks } from './ProjectActionCreator';
import { Project } from '../../model/project';
import * as ProjectService from '../../service/ProjectService';

export class ProjectDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  loadTasks() {
    // TODO
    ProjectService.find().then(result => {
      this.dispatch(ProjectUpdateTasks(result.data));
    });
  }
  
  showProjectModal() {
    this.dispatch(ProjectIsShowProjectModal(true));
  }

  closeProjectModal() {
    this.dispatch(ProjectIsShowProjectModal(false));
  }

  updateProject(project: Project) {
    this.dispatch(ProjectUpdateProject(project));
  }

}

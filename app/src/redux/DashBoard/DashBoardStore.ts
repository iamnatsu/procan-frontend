import { Record, Map, List } from 'immutable';
import { Project } from '../../model/project';


const DashBoardRecord = Record({ 
  isShowProjectModal: false,
  project: Map(),
  projects: List()
});
export default class DashBoardStore extends DashBoardRecord {

  isShowProjectModal() {
    return this.get('isShowProjectModal');
  }

  setIsShowProjectModal(isShowProjectModal: boolean): this {
    return this.set('isShowProjectModal', isShowProjectModal) as this;
  }

  getProject(): Map<string, any> {
    return this.get('project');
  }

  setProject(project: Project): this {
    return this.set('project', Map(project)) as this;
  }

  getProjects(): List<Project> {
    return this.get('projects');
  }

  setProjects(projects: Array<Project>): this {
    return this.set('projects', List(projects)) as this;
  }

}

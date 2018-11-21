import { Record, Map, List } from 'immutable';
import { Project } from '../../model/project';
import { Task } from '../../model/task';


const DashBoardRecord = Record({ 
  isShowProjectModal: false,
  project: Map(),
  tasks: List()
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

  getTasks(): List<Task> {
    return this.get('tasks');
  }

  setTasks(projects: Array<Task>): this {
    return this.set('tasks', List(projects)) as this;
  }

}

import { Record, Map, List } from 'immutable';
import { Project } from '../../model/project';
import { Task } from '../../model/task';

const ProjectRecord = Record({ 
  isShowProjectModal: false,
  isShowTaskModal: false,
  project: Map(),
  tasks: List()
});

export default class ProjectStore extends ProjectRecord {

  isShowProjectModal() {
    return this.get('isShowProjectModal');
  }

  setIsShowProjectModal(isShowProjectModal: boolean): this {
    return this.set('isShowProjectModal', isShowProjectModal) as this;
  }

  isShowTaskModal() {
    return this.get('isShowTaskModal');
  }

  setIsShowTaskModal(isShowTaskModal: boolean): this {
    return this.set('isShowTaskModal', isShowTaskModal) as this;
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

  addTask(task: Task) {
    return this.setTasks(this.getTasks().push(task).toJS());
  }

  setTasks(tasks: Array<Task>): this {
    return this.set('tasks', List(tasks)) as this;
  }

}

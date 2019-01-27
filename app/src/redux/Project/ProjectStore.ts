import { Record, Map, List } from 'immutable';
import { Project } from '../../model/project';
import { ViewMode, PopOverTarget } from '../../model/common';
import { Task } from '../../model/task';

const ProjectRecord = Record({ 
  isShowProjectModal: false,
  isShowTaskModal: false,
  menuAnchor: null,
  menuAnchorPos: null,
  project: Map(),
  allTasks: List(),
  tasks: List(),
  viewMode: ViewMode.KANBAN,
  popOverTarget: null,
  popOverAnchor: null,
  popOverValue: null,
  popOverAction: null,
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
    if (isShowTaskModal) {
      return this.set('isShowTaskModal', isShowTaskModal) as this;
    } else {
      return this.set('isShowTaskModal', isShowTaskModal).set('menuAnchor', null) as this;
    }
  }

  getMenuAnchor() {
    return this.get('menuAnchor');
  }

  getMenuAnchorPos() {
    return this.get('menuAnchorPos');
  }

  setMenuAnchor(menuAnchor: HTMLElement, pos: number): this {
    return this.set('menuAnchor', menuAnchor).set('menuAnchorPos', pos) as this;
  }

  getProject(): Map<string, any> {
    return this.get('project');
  }

  setProject(project: Project): this {
    return this.set('project', Map(project)) as this;
  }

  addTask(task: Task) {
    return this.setTasks(this.getTasks().push(task).toJS());
  }

  initTasks(tasks: Array<Task>): this {
    return this.set('tasks', List(tasks)).set('allTasks', List(tasks)) as this;
  }

  getTasks(): List<Task> {
    return this.get('tasks');
  }

  setTasks(tasks: Array<Task>): this {
    return this.set('tasks', List(tasks)) as this;
  }

  getAllTasks(): List<Task> {
    return this.get('allTasks');
  }

  updateTask(task: Task): this {
    const tasks = this.getTasks();
    const i = tasks.findIndex(t => !!t && t.id === task.id);
    return this.set('tasks', tasks.set(i, task)) as this;
  }

  getViewMode(): ViewMode {
    return this.get('viewMode');
  }

  setViewMode(viewMode: ViewMode): this {
    return this.set('viewMode', viewMode) as this;
  }

  getPopOverTarget(): PopOverTarget {
    return this.get('popOverTarget');
  }

  getPopOverAnchor(): HTMLElement {
    return this.get('popOverAnchor');
  }

  getPopOverValue(): string {
    return this.get('popOverValue');
  }

  setPopOverValue(value: string): this {
    return this.set('popOverValue', value) as this;
  }

  getPopOverAction(): Function {
    return this.get('popOverAction');
  }

  setPopOver(target: PopOverTarget, anchor: HTMLElement, value: string, action: (value: string) => void): this {
    return this.set('popOverTarget', target).set('popOverAnchor', anchor)
      .set('popOverValue', value).set('popOverAction', action) as this;
  }
}

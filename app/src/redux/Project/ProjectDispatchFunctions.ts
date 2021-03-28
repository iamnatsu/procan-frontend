import { ProjectIsShowProjectModal, ProjectIsShowTaskModal, ProjectUpdateProject, ProjectLoadTasks, ProjectUpdateTasks, ProjectUpdateTask, ProjectAddTask, ProjectChangeView, ProjectShowPopOver, ProjectUpdatePopOverValue, ProjectUpdateMenuAnchor } from './ProjectActionCreator';
import { Project } from '../../model/project';
import * as ProjectService from '../../service/ProjectService';
import * as TaskService from '../../service/TaskService';
import { Task } from 'src/model/task';
import { ViewMode, PopOverTarget } from 'src/model/common';

export class ProjectDispatchFunctions {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  loadProject(id: string) {
    // TODO
    ProjectService.get(id).then(result => {
      this.dispatch(ProjectUpdateProject(result.data));
    });
  }

  loadTasks(projectId: string) {
    TaskService.find(projectId).then(result => {
      this.dispatch(ProjectLoadTasks(result.data));
    });
  }

  initTasks(tasks: Array<Task>) {
    this.dispatch(ProjectLoadTasks(tasks));
  }

  updateTask(task: Task) {
    TaskService.put(task).then(res => {
      this.dispatch(ProjectUpdateTask(res.data));
    });
  }

  updateTasks(tasks: Array<Task>) {
    this.dispatch(ProjectUpdateTasks(tasks));
  }

  addStatus(projectId: string, name: string) {
    return ProjectService.get(projectId).then(result => {
      const statuses = result.data.statuses;
      if (!statuses || statuses.length <= 0) {
        result.data.statuses = [{name: name, pos: 0}]
      } else {
        let maxPos = 0;
        statuses.forEach(s => {
          if (s.pos >= maxPos) maxPos = s.pos + 1
        });
        statuses.push({name: name, pos: maxPos})
      }
      return ProjectService.put(result.data).then(updated => {
        this.dispatch(ProjectUpdateProject(updated.data));
      })
    })
  }

  addTask(task: Task) {
    TaskService.post(task).then(result => {
      ProjectService.get(task.projectId).then(res => {
        if(res.data.ganttOrder) {
          res.data.ganttOrder.push(result.data.id);
        } else {
          res.data.ganttOrder = [result.data.id];
        }
        this.dispatch(ProjectUpdateProject(res.data));
        ProjectService.put(res.data);
      });
      this.dispatch(ProjectAddTask(result.data));
    })
  }

  showStatusMenu(anchor: HTMLElement, pos: number) {
    this.dispatch(ProjectUpdateMenuAnchor(anchor, pos));
  }

  closeStatusMenu() {
    this.dispatch(ProjectUpdateMenuAnchor());
  }
  
  showProjectModal() {
    this.dispatch(ProjectIsShowProjectModal(true));
  }

  closeProjectModal() {
    this.dispatch(ProjectIsShowProjectModal(false));
  }
  
  showTaskModal() {
    this.dispatch(ProjectIsShowTaskModal(true));
  }

  closeTaskModal() {
    this.dispatch(ProjectIsShowTaskModal(false));
  }

  updateProject(project: Project) {
    return ProjectService.put(project).then(result => {
      this.dispatch(ProjectUpdateProject(project));
    });
  }

  localUpdateProject(project: Project) {
    this.dispatch(ProjectUpdateProject(project));
  }

  updateViewMode(viewMode: ViewMode) {
    this.dispatch(ProjectChangeView(viewMode));
  }

  showPopOver(target: PopOverTarget, anchor: HTMLElement, value: string, action: (v: string) => {}) {
    this.dispatch(ProjectShowPopOver(target, anchor, value, action));
  }

  closePopOver() {
    this.dispatch(ProjectShowPopOver());
  }

  updatePopOverValue(value: string) {
    this.dispatch(ProjectUpdatePopOverValue(value));
  }

}

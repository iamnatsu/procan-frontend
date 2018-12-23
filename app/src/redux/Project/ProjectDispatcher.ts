import { ProjectIsShowProjectModal, ProjectIsShowTaskModal, ProjectUpdateProject, ProjectUpdateTasks, ProjectAddTask } from './ProjectActionCreator';
import { Project } from '../../model/project';
import * as ProjectService from '../../service/ProjectService';
import * as TaskService from '../../service/TaskService';
import { Task } from 'src/model/task';

export class ProjectDispatcher {
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
    // TODO
    TaskService.find(projectId).then(result => {
      this.dispatch(ProjectUpdateTasks(result.data));
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
      this.dispatch(ProjectAddTask(result.data));
    })
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
    ProjectService.put(project).then(result => {
      this.dispatch(ProjectUpdateProject(project));
    });
  }

}

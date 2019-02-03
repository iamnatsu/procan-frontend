import * as HttpService from './HttpService'
import { TASK } from './URL';
import { Task } from '../model/task';

export function post(task: Task): HttpService._Promise<Task> {
  return HttpService.post(TASK, task).then((response: HttpService._Response<Task>) => {
    return response;
  });
}

export function put(task: Task): HttpService._Promise<Task> {
  return HttpService.put(TASK + '/' + task.id, task).then((response: HttpService._Response<Task>) => {
    return response;
  });
}

export function get(id: String): HttpService._Promise<Task> {
  const url = TASK + '/' + id;
  return HttpService.get(url).then((response: HttpService._Response<Task>) => {
    return response;
  });
}

export function find(projectId: string): HttpService._Promise<Array<Task>> {
  return HttpService.get(TASK + '/find/' + projectId).then((response: HttpService._Response<Array<Task>>) => {
    return response;
  });
}

export function del(id: String): HttpService._Promise<Task> {
  const url = TASK + '/' + id;
  return HttpService.del(url).then((response: HttpService._Response<Task>) => {
    return response;
  });
}

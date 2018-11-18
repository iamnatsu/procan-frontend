import * as HttpService from './HttpService'
import { PROJECT } from './URL';
import { Project } from '../model/project';

export function post(project: Project): HttpService._Promise<Project> {
  return HttpService.post(PROJECT, project).then((response: HttpService._Response<Project>) => {
    return response;
  });
}

export function get(id: String): HttpService._Promise<Project> {
  const url = PROJECT + '/' + id;
  return HttpService.get(url).then((response: HttpService._Response<Project>) => {
    return response;
  });
}

export function find(): HttpService._Promise<Array<Project>> {
  return HttpService.get(PROJECT).then((response: HttpService._Response<Array<Project>>) => {
    return response;
  });
}
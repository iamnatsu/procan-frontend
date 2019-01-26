import * as HttpService from './HttpService'
import { GROUP } from './URL';
import { Group } from '../model/group';

export function post(group: Group): HttpService._Promise<Group> {
  return HttpService.post(GROUP, group).then((response: HttpService._Response<Group>) => {
    return response;
  });
}

export function put(group: Group): HttpService._Promise<Group> {
  return HttpService.put(GROUP + '/' + group.id, group).then((response: HttpService._Response<Group>) => {
    return response;
  });
}

export function get(id: String): HttpService._Promise<Group> {
  const url = GROUP + '/' + id;
  return HttpService.get(url).then((response: HttpService._Response<Group>) => {
    return response;
  });
}

export function find(): HttpService._Promise<Array<Group>> {
  return HttpService.get(GROUP).then((response: HttpService._Response<Array<Group>>) => {
    return response;
  });
}

export function del(id: string) {
  const url = GROUP + '/' + id;
  return HttpService.del(url).then((response: HttpService._Response<Group>) => {
    return response;
  });
}
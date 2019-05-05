import * as HttpService from './HttpService'
import * as AuthService from './AuthService'
import { USER } from './URL';
import { FilterQuery } from '../model/common';
import { User } from '../model/user';

export function post(user: User): HttpService._Promise<User> {
  return HttpService.post(USER, user).then((response: HttpService._Response<User>) => {
    return response;
  });
}

export function put(task: User): HttpService._Promise<User> {
  return HttpService.put(USER + '/' + task.id, task).then((response: HttpService._Response<User>) => {
    return AuthService.sessionProceed().then(() => {
      return response;
    });
  });
}

export function get(id: String): HttpService._Promise<User> {
  const url = USER + '/' + id;
  return HttpService.get(url).then((response: HttpService._Response<User>) => {
    return response;
  });
}

export function find(query: FilterQuery<User>): HttpService._Promise<Array<User>> {
  return HttpService.post(USER + '/_find', query).then((response: HttpService._Response<Array<User>>) => {
    return response;
  });
}

export function suggest(request: {key: keyof User, value: string}): HttpService._Promise<Array<User>> {
  return HttpService.post(USER + '/_suggest', request).then((response: HttpService._Response<Array<User>>) => {
    return response;
  });
}
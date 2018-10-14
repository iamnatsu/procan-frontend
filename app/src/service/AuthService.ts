import moment from 'moment';
import * as HttpService from './HttpService'
import { AUTH_SESSION, AUTH_LOGIN } from './URL';
import { Credential } from 'src/types/Credential';

export function getLoginUser(): HttpService._Promise<Credential> {
  return HttpService.get(AUTH_SESSION); 
}

export function sessionProceed(): HttpService._Promise<Credential> {
  return HttpService.get(AUTH_SESSION); 
}

export function login(id: string, password: string): HttpService._Promise<Credential> {
  if(true) {
      const res: HttpService._Response<any> = {data: { id:"xxxx", loginId: "nwada", name: "natsuho wada"}} as HttpService._Response<any>;
      return Promise.resolve(res);
  }
  let req = new URLSearchParams();
  req.append('loginId', id);
  req.append('password', password);
  return HttpService.post(AUTH_LOGIN, req, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response: HttpService._Response<Credential>) => {
    HttpService.setToken({ token: response.data.id, expireAt: moment(response.data.expireAt).toDate() });
    return response;
  });
}
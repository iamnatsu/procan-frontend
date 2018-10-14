import moment from 'moment';
import * as HttpService from './HttpService'
import { REGIST } from './URL';
import { Credential } from 'src/types/Credential';

export function prepare(email: string): HttpService._Promise<Credential> {
  const req = { email: email };
  return HttpService.post(REGIST, req, { headers: { 'Authorization': 'Bearer dummy', 'Content-Type': 'application/json' } }).then((response: HttpService._Response<Credential>) => {
    HttpService.setToken({ token: response.data.id, expireAt: moment(response.data.expireAt).toDate() });
    return response;
  });
}

export function regist(name: string, email: string, password: string, token: string): HttpService._Promise<Credential> {
  const req = { 
    name: name,
    email: email,
    password: password,
    token: token,
  };
  return HttpService.put(REGIST, req, { headers: { 'Authorization': 'Bearer dummy', 'Content-Type': 'application/json' } }).then((response: HttpService._Response<Credential>) => {
    HttpService.setToken({ token: response.data.id, expireAt: moment(response.data.expireAt).toDate() });
    return response;
  });
}
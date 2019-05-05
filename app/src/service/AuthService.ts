import moment from 'moment';
import * as i18next from 'i18next';
import * as HttpService from './HttpService'
import { AUTH_SESSION, AUTH_LOGIN } from './URL';
import { Credential } from 'src/types/Credential';
import { LANGUAGE } from '../model/common';

export function getLoginUser(): HttpService._Promise<Credential> {
  return HttpService.get(AUTH_SESSION).then(response => {
    if (i18next.t('current') != response.data.lang) {
      i18next.changeLanguage(response.data.lang || LANGUAGE.ja_JP);
    } else if (!response.data.lang && i18next.t('current') != LANGUAGE.ja_JP) {
      i18next.changeLanguage(LANGUAGE.ja_JP);
    }
    return response;
  }); 
}

export function sessionProceed(): HttpService._Promise<Credential> {
  return HttpService.put(AUTH_SESSION).then((response: HttpService._Response<Credential>) => {
    HttpService.setToken({ token: response.data.id, expireAt: moment(response.data.expireAt).toDate() });
    return response;
  }); 
}

export function login(id: string, password: string): HttpService._Promise<Credential> {
  const req = {
    loginId: id,
    password: password
  }
  return HttpService.post(AUTH_LOGIN, req, { headers: { 'Authorization': 'Bearer dummy', 'Content-Type': 'application/json' } }).then((response: HttpService._Response<Credential>) => {

    i18next.changeLanguage(response.data.lang || LANGUAGE.ja_JP);
    HttpService.setToken({ token: response.data.id, expireAt: moment(response.data.expireAt).toDate() });
    return response;
  });
}

export function logout(): HttpService._Promise<any> {
  return HttpService.del(AUTH_SESSION).then(r => {
    HttpService.setToken();
    return r;
  }); 
}

import moment from 'moment';
import axios from 'axios';
import { AxiosAdapter, AxiosResponse, AxiosRequestConfig } from 'axios';

let _defaultConfig: _Config = {};
let _token = '', _expireAt: moment.Moment;
export const http = axios.create();

const AuthTokenKey = 'auth_token';
const AuthTokenExpireKey = 'expireAt';

export function getToken(): string {
  const savedToken = window.localStorage.getItem(AuthTokenKey);
  _token = (savedToken != null) ? savedToken : '';
  return _token;
}

export function getTokenExpire() {
  const expireAt = window.localStorage.getItem(AuthTokenExpireKey);
  if (expireAt != null) _expireAt = moment(expireAt);
  return _expireAt;
}

export function setToken(args?: { token: string, expireAt: Date }) {
  if (args && args.token) {
    window.localStorage.setItem(AuthTokenKey, args.token);
    window.localStorage.setItem(AuthTokenExpireKey, args.expireAt.toISOString());
    initDefaultConfig(args.token);
  } else {
    window.localStorage.removeItem(AuthTokenKey);
    initDefaultConfig();
  }
}

export function setTokenByCacheOnly(token: string) {
  _token = token;
}

function initDefaultConfig(token?: string | null) {
  if (token) {
    _defaultConfig = { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
  } else {
    _defaultConfig = { headers: { 'Content-Type': 'application/json' } };
  }
}

function getDefaultConfig(forced?: boolean) {
  if (forced || !Object.keys(_defaultConfig).length) initDefaultConfig(getToken());
  return _defaultConfig;
}

function getConfig(config?: _Config) {
  return config ? Object.assign({}, getDefaultConfig(), config) : getDefaultConfig();
}

function wrapper(promise: _Promise<any>) {
  return promise.then((response) => {
    // if (response.status === 401) setToken();
    return response;
  }, (response) => {
    //if (!response.config.isTokenManualHandle && response.response.status === 401) setToken();
    return Promise.reject(response) as _Promise<any>;
  });
}

export function initDefaultAdapter(adapter: AxiosAdapter) {
  http.defaults.adapter = adapter;
}

export function get(url: string, config?: _Config) {
  return wrapper(http.get(url, getConfig(config)));
}

export function post(url: string, data?: any, config = _defaultConfig) {
  return wrapper(http.post(url, data, getConfig(config)));
}

export function put(url: string, data?: any, config = _defaultConfig) {
  return wrapper(http.put(url, data, getConfig(config)));
}

export function del(url: string, config = _defaultConfig) {
  return wrapper(http.delete(url, getConfig(config)));
}

export function upload(url: string, file: File, name?: string, config = _defaultConfig) {
  var params = new FormData();
  params.append('file', file);
  params.append('name', name || '')
  return wrapper(http.post(url, params, getConfig(config)));
}

export interface _Response<T> extends AxiosResponse {
  data: T;
}
export interface _Error extends Error {
  config: _Config;
  code?: string;
  response?: AxiosResponse;
}

export interface _Promise<T> extends Promise<_Response<T>> { }
export interface _Config extends AxiosRequestConfig {
  isTokenManualHandle?: boolean;
}
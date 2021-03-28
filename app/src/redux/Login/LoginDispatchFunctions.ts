import * as ActionType from './LoginActionCreator';
import { Credential } from '../../types/Credential';
import * as AuthService from '../../service/AuthService';
import { setToken } from '../../service/HttpService';

export default class LoginDispatchFunctions {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch;
  }

  refreshLoginUser() {
    return AuthService.getLoginUser().then(response => {
      setToken({token: response.data.id, expireAt: new Date(response.data.expireAt)});
      this.dispatch(ActionType.UpdateLoginUser(response.data));
      return Promise.resolve();
    }).catch(result => {
      return Promise.reject(result);
    })
  }

  updateLoginUser(user: Credential) {
    this.dispatch(ActionType.UpdateLoginUser(user));
  }

  login(loginId: string, password: string) {
    return AuthService.login(loginId, password).then(response => {
      this.dispatch(ActionType.UpdateLoginUser(response.data));
      return Promise.resolve()
    }).catch(result => {
      this.dispatch(ActionType.SetErrorMessage('ログインIDまたはパスワードに誤りがあります。'));
      return Promise.reject(result);
    })
  }

  logout() {
  }

  sessionProceed() {
  }

  destory() {
    this.dispatch(ActionType.Destory());
  }
}

import * as ActionType from './LoginActionCreator';
import { Credential } from '../../types/Credential';
import * as AuthService from '../../service/AuthService';

export default class LoginDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch;
  }

  refreshLoginUser() {
    return Promise.resolve()
  }

  updateLoginUser(user: Credential) {
    this.dispatch(ActionType.UpdateLoginUser(user));
  }

  login(loginId: string, password: string) {
    AuthService.login(loginId, password).then(response => {
      this.dispatch(ActionType.UpdateLoginUser(response.data));
    })
    return Promise.resolve()
  }

  logout() {
  }

  sessionProceed() {
  }

  destory() {
    this.dispatch(ActionType.Destory());
  }
}

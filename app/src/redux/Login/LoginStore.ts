import { Record, Map, fromJS } from 'immutable';
import { Credential } from '../../types/Credential';

const LoginRecord = Record({ loginUser: Map(), errorMessage: '' });
export default class LoginStore extends LoginRecord {

  setLoginUser(user: Credential): this {
    return this.set('loginUser', fromJS(user)) as this;
  }

  getLoginUser(): Map<keyof Credential, string> {
    return this.get('loginUser');
  }

  isLogined() {
    return this.get('loginUser').size != 0;
  }

  getErrorMessage() {
    return this.get('errorMessage');
  }

  setErrorMessage(errorMessage: string): this {
    return this.set('errorMessage', errorMessage) as this;
  }
}

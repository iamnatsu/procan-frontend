import * as React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import LoginDispatcher from '../../redux/Login/LoginDispatcher';
import LoginStore from '../../redux/Login/LoginStore';
import * as AuthService from '../../service/AuthService';
import { transitionToLoginPage } from '../..//util/transition';

export interface AuthProps extends React.Props<{}> {
  action: {
    login: LoginDispatcher;
  }
  login: LoginStore;
}

export class Auth extends React.Component<AuthProps, any>  {
  private intervalId = 0;
  componentWillMount() {
    this.checkLoginUser(this.props);

    if (this.props.login.isLogined()) {
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = setInterval(this.proceedSessionIfNeed, 300000)
    }
  }

  componentWillUpdate(nextProps: AuthProps) {
    if (!nextProps.login.isLogined()) {
      this.checkLoginUser(nextProps);
    } else {
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = setInterval(this.proceedSessionIfNeed, 300000)
    }
  }

  proceedSessionIfNeed() {
    AuthService.getLoginUser().then((response) => {
      let c = response.data;
      if (!c || !c.expireAt) return;

      let expireAt = new Date(c.expireAt)
      if ((expireAt.getTime() - new Date().getTime()) < 600000) {
        AuthService.sessionProceed();
      }
    })
  }

  render() {
    if (this.props.login.isLogined()) {
      return (<Route children={this.props.children} />);
    } else {
      return (<div />);
    }
  }

  checkLoginUser(props: AuthProps) {
    if (!props.login.isLogined()) {
      props.action.login.refreshLoginUser().then(async () => {
        if (!this.props.login.getLoginUser().toJS().id) transitionToLoginPage();
      }).catch((result: any) => {
        if (result && result.response && result.response.status && 400 <= result.response.status && result.response.status < 600) {
          transitionToLoginPage();
        } else {
          throw result;
        }
      });
    }
  }
}

const mapStateToProps = (state: any) => {
  return { login: state.login };
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    action: {
      login: new LoginDispatcher(dispatch),
    }
  }
}
export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)((Auth) as any);

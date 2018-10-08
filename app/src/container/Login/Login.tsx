import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { TextField, Button/*, MenuItem, SelectField*/ } from '@material-ui/core';
import { transitionTo } from '../../util/transition';
import { AppState } from 'src/redux';
import LoginStore from 'src/redux/Login/LoginStore';
import LoginDispatcher from '../../redux/Login/LoginDispatcher';

export interface ReactProps extends RouteComponentProps<any> { }

export interface LoginProps extends React.Props<any> {
  style?: React.CSSProperties;
  login: LoginStore;
}

type MergedProps = LoginProps & LoginStateProps & ReactProps;

export class Login extends React.Component<MergedProps, LoginState> {
  public workspaceInput: any;
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props: MergedProps) {
    super(props);
    this.state = { loading: true, isSubmitting: false, loginId: '', password: '' };
  }

  componentWillMount() {
    this.props.action.login.refreshLoginUser().then(async res => {
      /*
      if (res.status === 200 && res.data && res.data.userId) {
        await this.setCurrentWorkspace(this.props.workspace.getWorkspaceId() || this.getLastAccessWorkspace());
        this.context.router.history.push(this.getRedirectPath());
      }*/
    });
  }

  async componentDidMount() {
    this.setState(Object.assign({}, this.state, { loading: false }));
  }

  render() {
    if (this.state.loading) return null;

    console.dir(this.props.login.getLoginUser().toJS());
    return (
      <MuiThemeProvider theme={loginMuiTheme}>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: "#88C542"}}>
          <div style={{ width: 400, margin: 'auto', paddingTop: 'calc(50vh - 175px)'}}>
            <h2 style={{ color: 'white' }}>Procan</h2>
            <form onSubmit={this.handleLogin.bind(this)} style={{ padding: 20 }}>
              <TextField id='loginId' label='ログインID / メールアドレス' fullWidth={true} InputLabelProps={{ shrink: true }} autoFocus={true} style={{marginBottom: 20}} onChange={this.handleChange}/>
              <TextField id='password' label='パスワード' type='password' fullWidth={true} InputLabelProps={{ shrink: true }} style={{marginBottom: 20}} onChange={this.handleChange} />
              {this.renderErrorMessage()}
              <div style={{ textAlign: 'right', marginTop: 15 }}><Button variant="contained" type='submit' fullWidth disabled={this.state.isSubmitting} >ログイン</Button></div>
            </form>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const param: { [k: string]: string } = {};
    param[event.target.id] = event.target.value;
    this.setState(Object.assign({}, this.state, param));
  };

  handleLogin(e: any) {
    e.preventDefault();
    const loginId = this.state.loginId
    const password = this.state.password;

    this.setState(Object.assign({}, this.state, { isSubmitting: true }));
    this.props.action.login.login(loginId, password).then(async response => {
      this.setState(Object.assign({}, this.state, { isSubmitting: false }));
      transitionTo('/dashboard');
    }).catch(() => {
      this.setState(Object.assign({}, this.state, { isSubmitting: false }));
    });
  }

  renderErrorText() {
    return (this.props.login.getErrorMessage()) ? ' ' : '';
  }

  renderErrorMessage(): any {
    return (this.props.login.getErrorMessage()) ? (<div style={{ color: '#f44336', fontSize: 14, padding: '10px 0' }}>{this.props.login.getErrorMessage()}</div>) : '';
  }
}

const mapStateToProps = (state: AppState) => {
  return { login: state.login };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    action: {
      login: new LoginDispatcher(dispatch),
    }
  }
}

const loginMuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#fff"
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        color: '#88C542',
        backgroundColor: "white"
      }
    },
    MuiInputLabel: {
      root: {
        color: 'white',
      }
    },
    MuiFormLabel: {
      focused: {
        "&$focused": {
          color: "white"
        }
      }
    },
    MuiInput: {
      root: {
        color: 'white',
      },
      underline: {
        '&:before': {
          borderBottom: '1px solid #fff',
        },
        '&:hover:before': {
          borderBottom: '1px solid #fff',
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: '1px solid #fff',
        },
        '&:after': {
          borderBottom: '2px solid #fff',
        },
      }
    },
  }
});

export interface LoginStateProps {
  action: {
    login: LoginDispatcher;
  }
}

interface LoginState extends React.Props<any> {
  loading: boolean;
  isSubmitting: boolean;
  loginId: string;
  password: string;
}

const component: any = connect(mapStateToProps, mapDispatchToProps)(Login);
export const LoginContainer: React.ComponentClass<any> = withRouter(component);

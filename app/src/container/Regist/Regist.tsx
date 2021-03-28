import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { TextField, Button/*, MenuItem, SelectField*/ } from '@material-ui/core';
import { transitionTo } from '../../util/transition';
import { AppState } from 'src/redux';
import { topMuiTheme } from '../../config/Theme';

import * as RegistService from '../../service/RegistService'
import { MessageDialogDispatchFunctions } from "../../redux/component/MessageDialog/MessageDialogDispatchFunctions";

export interface ReactProps extends RouteComponentProps<any> { }

export interface LoginProps extends React.Props<any> {
  style?: React.CSSProperties;
}

type MergedProps = LoginProps & LoginStateProps & ReactProps;

export class Regist extends React.Component<MergedProps, LoginState> {
  public workspaceInput: any;
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props: MergedProps) {
    super(props);
    this.state = { loading: true, isSubmitting: false, name: '', email: '', password: '' };
  }

  componentWillMount() {
  }

  async componentDidMount() {
    this.setState(Object.assign({}, this.state, { loading: false }));
  }

  render() {
    if (this.state.loading || !this.props.match.params || !this.props.match.params.token) return null;

    return (
      <MuiThemeProvider theme={topMuiTheme}>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: "#88C542"}}>
          <div style={{ width: 400, margin: 'auto', paddingTop: 'calc(50vh - 175px)'}}>
            <h2 style={{ color: 'white' }}>Procan Registration</h2>
            <form onSubmit={this.handleRegist.bind(this)} style={{ padding: 20 }}>
              <TextField id='name' label='your name' fullWidth={true} InputLabelProps={{ shrink: true }} autoFocus={true} style={{marginBottom: 20}} onChange={this.handleChange}/>
              <TextField id='email' label='email (LOGIN ID)' fullWidth={true} InputLabelProps={{ shrink: true }} style={{marginBottom: 20}} onChange={this.handleChange}/>
              <TextField id='password' label='password' type='password' fullWidth={true} InputLabelProps={{ shrink: true }} style={{marginBottom: 20}} onChange={this.handleChange} />
              <div style={{ textAlign: 'right', marginTop: 15 }}><Button variant="contained" type='submit' fullWidth disabled={this.state.isSubmitting} >Regist</Button></div>
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

  handleRegist(e: any) {
    e.preventDefault();
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;

    this.setState(Object.assign({}, this.state, { isSubmitting: true }));
    RegistService.regist(name, email, password, this.props.match.params.token).then(res => {
      this.props.action.modal.showMessage('ご登録、ありがとうございます', 
      [{ message: '登録完了メールをお送りいたしました。' }, { message: '次の画面からログインし、Procan をご利用ください。' }],
      () => {
        transitionTo('/login');
      });

    }).catch(e => {
      this.props.action.modal.showMessage('', [{ message: e && e.response && e.response.data ? e.response.data.message : 'unknown error occurred' }]);
      this.setState(Object.assign({}, this.state, { isSubmitting: false }));
    })
  }

}

const mapStateToProps = (state: AppState) => {
  return { login: state.login };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    action: {
      modal: new MessageDialogDispatchFunctions(dispatch),
    }
  }
}

export interface LoginStateProps {
  action: {
    modal: MessageDialogDispatchFunctions;
  }
}

interface LoginState extends React.Props<any> {
  loading: boolean;
  isSubmitting: boolean;
  name: string;
  email: string;
  password: string;
}

const component: any = connect(mapStateToProps, mapDispatchToProps)(Regist);
export const RegistContainer: React.ComponentClass<any> = withRouter(component);

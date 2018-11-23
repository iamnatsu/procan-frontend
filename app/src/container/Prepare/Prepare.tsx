import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { MuiThemeProvider} from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { AppState } from 'src/redux';
import * as RegistService from '../../service/RegistService'
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { topMuiTheme } from '../../config/Theme';

export interface ReactProps extends RouteComponentProps<any> { }

export interface LoginProps extends React.Props<any> {
  style?: React.CSSProperties;
}

type MergedProps = LoginProps & LoginStateProps & ReactProps;

export class Prepare extends React.Component<MergedProps, LoginState> {
  public workspaceInput: any;
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props: MergedProps) {
    super(props);
    this.state = { loading: true, isSubmitting: false, email: '', open: false, message: '' };
  }

  componentWillMount() {
  }

  async componentDidMount() {
    this.setState(Object.assign({}, this.state, { loading: false }));
  }

  render() {
    if (this.state.loading) return null;
    return (
      <MuiThemeProvider theme={topMuiTheme}>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#88C542'}}>
          <div style={{ width: 400, margin: 'auto', paddingTop: 'calc(50vh - 175px)'}}>
            <h2 style={{ color: 'white' }}>Procan</h2>
            <form onSubmit={this.handlePrepare.bind(this)} style={{ padding: 20 }}>
              <TextField autoComplete='off' id='email' label='email' fullWidth={true} InputLabelProps={{ shrink: true }} autoFocus={true} style={{marginBottom: 20}} onChange={this.handleChange}/>
              <div style={{ textAlign: 'right', marginTop: 15 }}><Button variant='contained' type='submit' fullWidth disabled={this.state.isSubmitting} >Sign Up (Send Mail)</Button></div>
            </form>
            <a href='#/login' style={{ color: 'white', display: 'block', textAlign: 'center', textDecoration: 'none' }}>Sign In</a>
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

  handlePrepare(e: any) {
    e.preventDefault();
    const email = this.state.email;

    this.setState(Object.assign({}, this.state, { isSubmitting: true }));
    RegistService.prepare(email).then(res => {
      this.setState(Object.assign({}, this.state, { isSubmitting: false }));
      this.props.action.modal.showMessage('メールを送信しました', [{ message: 'メールに記載されたURLより、ユーザー登録をお願いいたします' }]);
    }).catch(e => {
      this.setState(Object.assign({}, this.state, { isSubmitting: false }));
      this.props.action.modal.showMessage('', [{ message: e && e.response && e.response.data ? e.response.data.message : 'unknown error occurred' }]);
    })
  }

  handleClose = () => {
    this.setState({ open: false });
  };

}

const mapStateToProps = (state: AppState) => {
  return {  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    action: {
      modal: new MessageDialogDispatcher(dispatch),
    }
  }
}

export interface LoginStateProps {
  action: {
    modal: MessageDialogDispatcher;
  }
}

interface LoginState extends React.Props<any> {
  loading: boolean;
  isSubmitting: boolean;
  email: string;
  open: boolean;
  message: string;
}

const component: any = connect(mapStateToProps, mapDispatchToProps)(Prepare);
export const PrepareContainer: React.ComponentClass<any> = withRouter(component);

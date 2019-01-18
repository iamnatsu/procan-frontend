import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { AppState } from '../../redux/index';
import { P_IVORY } from '../../config/Color';
import ProfileForm from '../../component/ProfileForm/ProfileForm'
import * as UserService from '../../service/UserService'
import { ProfileDispatcher } from '../../redux/Profile/ProfileDispatcher';
import { LoginState } from '../../redux/Login/LoginReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';

export interface ProfileViewerProps extends RouteComponentProps<any> { }
export interface ProfileViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProfileViewerProps;
class ProfileViewer extends React.Component<MergedProps, ProfileViewerState> {
  componentWillMount() {
    const userId = this.props.login.getLoginUser().get('userId');
    UserService.get(userId).then(result => {
      this.props.action.profile.updateUser(result.data);
    });
  }
  render() {
    return <div className="main-contents" style={{ backgroundColor: P_IVORY }}>
      <ProfileForm style={{ width: '300px', margin: 'auto'}} onSubmit={this.handleSubmit.bind(this)}></ProfileForm>
    </div>
  }

  handleSubmit(values: any) {
    if ((values.password || values.passwordc) && values.password != values.passwordc) {
      this.props.action.messageDialog.showMessage('パスワードが一致しません', []);
      return;
    }
    UserService.put(values).then(result => {
      this.props.action.messageDialog.showMessage('更新しました', []);
    });
  }
}

interface StateProps {
  login: LoginState
}

interface DispatchProps {
  action: {
    profile: ProfileDispatcher,
    messageDialog: MessageDialogDispatcher
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    login: state.login
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return { action: {
      profile: new ProfileDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch)
    }
  };
}

const component: any = connect(mapStateToProps, mapDispatchToProps)(ProfileViewer);
export default withRouter(component);
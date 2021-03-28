import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { AppState } from '../../redux/index';
import { P_IVORY } from '../../config/Color';
import ProfileForm from '../../component/ProfileForm/ProfileForm'
import * as UserService from '../../service/UserService'
import { ProfileDispatchFunctions } from '../../redux/Profile/ProfileDispatchFunctions';
import { LoginState } from '../../redux/Login/LoginReducer';
import { MessageDialogDispatchFunctions } from '../../redux/component/MessageDialog/MessageDialogDispatchFunctions';
import { withNamespaces, TransProps } from 'react-i18next';
import * as i18next from 'i18next';
import { LANGUAGE } from '../../model/common';

export interface ProfileViewerProps extends RouteComponentProps<any> { }
export interface ProfileViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProfileViewerProps & TransProps;
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
    const fn = () => {};
    const t = this.props.t || fn;
    if ((values.password || values.passwordc) && values.password != values.passwordc) {
      this.props.action.messageDialog.showMessage(t('unmatch password'), []);
      return;
    }
    UserService.put(values).then(result => {
      i18next.changeLanguage(result.data.lang || LANGUAGE.ja_JP);
      this.props.action.messageDialog.showMessage(t('updated'), []);
    });
  }
}

interface StateProps {
  login: LoginState
}

interface DispatchProps {
  action: {
    profile: ProfileDispatchFunctions,
    messageDialog: MessageDialogDispatchFunctions
  };
}

function mapStateToProps(state: AppState) {
  return {
    login: state.login
  };
}

function mapDispatchToProps(dispatch: any) {
  return { action: {
      profile: new ProfileDispatchFunctions(dispatch),
      messageDialog: new MessageDialogDispatchFunctions(dispatch)
    }
  };
}

const i18n = withNamespaces()(ProfileViewer as any)
const component: any = connect(mapStateToProps, mapDispatchToProps)(i18n);
export default withRouter(component);
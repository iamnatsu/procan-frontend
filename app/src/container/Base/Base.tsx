import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter , Switch, Route } from 'react-router-dom';
import { LoginContainer as Login } from '../Login/Login';
import { RegistContainer as Regist } from '../Regist/Regist';
import { PrepareContainer as Prepare } from '../Prepare/Prepare';
import Auth from '../../component/Auth/Auth';
import ContentsBase from '../ContentsBase/ContentsBase';
import MessageDialog from '../../component/MessageDialog/MessageDialog';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.renderInner()}
        <MessageDialog />
      </div>
    );
  }
/*

          <Route strict exact path='/login/:workspaceId' component={Login} />
          <Route strict exact path='/start' component={Start} />
          <Route strict exact path='/signup' component={ConfirmAndSignUp} />
          <Route strict exact path='/inquiryworkspace' component={InquiryWorkspace} />
          <Route strict exact path='/createworkspace' component={CreateWorkspace} />
          <Route strict exact path='/workspaces/:email/:token' component={Workspaces} />
          <Auth>
            <Switch>
              <Route path='/' component={ContentsBase} />
            </Switch>
          </Auth>
*/
  renderInner() {
    return (
        <Switch>
          <Route strict exact path='/login' component={Login} />
          <Route strict exact path='/regist/:token' component={Regist} />
          <Route strict exact path='/prepare' component={Prepare} />
          <Auth>
            <Switch>
              <Route path='/' component={ContentsBase} />
            </Switch>
          </Auth>
        </Switch>
    );
  }

  isShowLoading() {
    return false;
  }
}
const mapStateToProps = (state: any) => {
  return { login: state.login };
};
const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const component: any = connect(mapStateToProps, mapDispatchToProps)(App);
export default withRouter(component);

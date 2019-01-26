import * as React from 'react';

import { withRouter, Switch, Route } from 'react-router-dom';
import AppBar from '../../component/AppBar/AppBar';
import DashBoardViewer from '../../container/DashBoard/DashBoardViewer';
import ProjectViewer from '../../container/Project/ProjectViewer';
import ProfileViewer from '../../container/Profile/ProfileViewer';

export interface ContentsBaseState { }
class ContentsBase extends React.Component<any, any> { 
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div key='contents-base'>
        <AppBar elevation={24}></AppBar>
        <Switch>
          <Route strict exact path='/dashboard' component={DashBoardViewer} />
          <Route strict exact path='/dashboard/:groupId' component={DashBoardViewer} />
          <Route strict exact path='/project/:id' component={ProjectViewer} />
          <Route strict exact path='/profile' component={ProfileViewer} />
        </Switch>
      </div>
    );
  }
  
}

export default withRouter(ContentsBase);

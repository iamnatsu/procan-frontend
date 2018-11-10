import * as React from 'react';

import { withRouter, Switch, Route } from 'react-router-dom';
import AppBar from '../../component/AppBar/AppBar';
import DashBoardViewer from '../../container/DashBoard/DashBoardViewer';
// import * as RoutePath from '../../config/RoutePath';

export interface ContentsBaseState { }
class ContentsBase extends React.Component<any, any> { 
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log("render contents-base")
    return (
      <div key="contents-base">
        <AppBar elevation={24}></AppBar>
        <Switch>
          <Route strict exact path='/dashboard' component={DashBoardViewer} />
        </Switch>
      </div>
    );
  }
  
}

export default withRouter(ContentsBase);

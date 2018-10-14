import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { AppState } from '../../redux/index';
import { RouteComponentProps, withRouter } from "react-router";
import * as AuthService from '../../service/AuthService'
import { transitionToLoginPage } from '../../util/transition';

export interface ReactProps extends RouteComponentProps<any> { }

export interface OwnProps extends React.Props<any> {
  parentId?: string;
  style?: React.CSSProperties;
}

export interface DashBoardViewerState extends React.Props<any> {
  toggleDrawer: boolean;
}

type DashBoardProps = StateProps & DispatchProps & OwnProps & ReactProps;

class DashBoard extends React.Component<DashBoardProps, DashBoardViewerState> {
  public observer: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      toggleDrawer: false
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps: DashBoardProps) {
  }

  render() {
    console.log("render dashboard")
    return (
      <div style={{ padding: '10px', width: '100vw', height: '100vh' }}>
        <Button variant="contained" type='submit' onClick={ this.logout }>Logout</Button>
      </div>
    );
  }

  logout() {
    AuthService.logout().then(() => {
      transitionToLoginPage();
    })
  }
}


interface StateProps {
}

interface DispatchProps {
}

function mapStateToProps(state: AppState) {
  return {  };
}

function mapDispatchToProps(dispatch: any) {
  return {
  };
}
/*
function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: DashBoardProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}
*/

const component: any = connect(mapStateToProps, mapDispatchToProps)(DashBoard);
export default withRouter(component);

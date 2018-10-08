import * as React from 'react';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import { AppState } from '../../redux/index';
import { RouteComponentProps, withRouter } from "react-router";

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
      <Paper style={{ width: '100%' }}>
      Dashboard
      </Paper>
    );
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

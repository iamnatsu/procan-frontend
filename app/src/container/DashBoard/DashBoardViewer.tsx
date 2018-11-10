import * as React from 'react';
import { connect } from 'react-redux';
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
    const style = { padding: '10px', width: '100vw', height: 'calc(100vh - 50px)' };
    return (
      <div style={style}>
        <p>グループを作成する</p>
        <p>プロジェクトを作成する</p>
      </div>
    );
  }

  logout() {
    AuthService.logout().then(() => {
      transitionToLoginPage();
    });
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

const component: any = connect(mapStateToProps, mapDispatchToProps)(DashBoard);
export default withRouter(component);

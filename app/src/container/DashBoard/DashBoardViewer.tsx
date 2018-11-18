import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from "react-router";
import Modal from '@material-ui/core/Modal';
import * as AuthService from '../../service/AuthService'
import * as ProjectService from '../../service/ProjectService'
import { transitionToLoginPage } from '../../util/transition';
import { DashBoardDispatcher } from '../../redux/DashBoard/DashBoardDispatcher';
import { DashBoardState } from '../../redux/DashBoard/DashBoardReducer';
import ProjectForm from '../../component/ProjectForm/ProjectForm';
import { Project } from '../../model/project';
import { Button } from '@material-ui/core';
import { List } from 'immutable';

export interface DashBoardProps extends RouteComponentProps<any> {
}

export interface DashBoardViewerState extends React.Props<any> {
  toggleDrawer: boolean;
}

type MergedProps = StateProps & DispatchProps & DashBoardProps;

class DashBoard extends React.Component<MergedProps, DashBoardViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      toggleDrawer: false
    }
  }

  componentWillMount() {
    this.props.action.dashboard.loadProjects();
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps: DashBoardProps) {
  }

  render() {
    const style = { padding: '10px', width: '100vw', height: 'calc(100vh - 50px)' };
    const modalStyle: React.CSSProperties = {
      top: '15vh',
      left: '25vw',
      width: '50vw',
      height: '70vh',
      backgroundColor: 'white',
      position: 'absolute'
    }
    const projects = this.props.dashboard.getProjects();
    return (
      <div style={style}>
        <p><Button color="primary">グループを作成する</Button></p>
        <p><Button onClick={this.handleOpenProjectModal.bind(this)} color="primary">プロジェクトを作成する</Button></p>
        { projects && projects.size > 0 && (
          this.renderProjects(projects)
        )}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.dashboard.isShowProjectModal()}
          onClose={this.handleCloseProjectModal.bind(this)}
        >
          <div style={modalStyle} >
            <ProjectForm onSubmit={this.handleSubmitProject.bind(this)} onClose={this.handleCloseProjectModal.bind(this)}></ProjectForm>
          </div>
        </Modal>
      </div>
    );
  }

  renderProjects(projects: List<Project>) {
    const rows: any = [];
    projects.forEach(pr => {
      if (pr) rows.push(<p key={ pr.id }>{ pr.name }</p>);
    });
    return rows;
  }

  handleSubmitProject(values: Project) {
    console.dir(values)
    ProjectService.post(values);
    this.props.action.dashboard.updateProject(values);
    this.handleCloseProjectModal();
  }
  handleOpenProjectModal() {
    this.props.action.dashboard.showProjectModal();
  }

  handleCloseProjectModal() {
    this.props.action.dashboard.closeProjectModal();
  }

  logout() {
    AuthService.logout().then(() => {
      transitionToLoginPage();
    });
  }
}


interface StateProps {
  dashboard: DashBoardState;
}

interface DispatchProps {
  action: {
    dashboard: DashBoardDispatcher,
  };
}

function mapStateToProps(state: AppState) {
  return { 
     dashboard: state.dashboard
   };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      dashboard: new DashBoardDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: DashBoardProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const container = connect<StateProps, DispatchProps, DashBoardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(DashBoard);
export default container as React.ComponentClass<DashBoardProps>;

import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from "react-router";
import { StyledComponentProps, CSSProperties } from '@material-ui/core/styles/withStyles';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

export interface ProjectViewerProps extends RouteComponentProps<any> { }
export interface ProjectViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProjectViewerProps & StyledComponentProps;

class ProjectViewer extends React.Component<MergedProps, ProjectViewerState> {
  componentWillMount() {
    this.props.action.project.loadTasks();
  }

  render() {
    const style = { width: '100vw', height: 'calc(100vh - 50px)' };
    const innerHeader = { width: '100vw', height: '30px', backgroundColor: 'lightblue' };
    const innerBody = { width: '100vw', height: 'calc(100% - 30px)', backgroundColor:'ivory' };
    return (
      <div style={style}>
        <div style={innerHeader}>{this.props.match.params.id}</div>
        <div style={innerBody}>
          <p><Button onClick={this.handleAddStatus.bind(this)} color="primary">ステータス（リスト）を追加</Button></p>
        </div>
      </div>
    );
  }

  handleAddStatus() {

  }
}


interface StateProps {
  project: ProjectState;
  messageDialog: MessageDialogState;
}

interface DispatchProps {
  action: {
    project: ProjectDispatcher,
    messageDialog: MessageDialogDispatcher
  };
}

function mapStateToProps(state: AppState) {
  return { 
    project: state.project,
    messageDialog: state.component.messageDialog
   };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      project: new ProjectDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectViewerProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  card: {
    minWidth: 200,
    maxWidth: 200,
    margin: '0 10px 10px 0',
    float: 'left'
  },
  action: {
    width: '100%'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

const container = connect<StateProps, DispatchProps, ProjectViewerProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectViewer);
export default withStyles(styles)(container) as React.ComponentClass<ProjectViewerProps>;

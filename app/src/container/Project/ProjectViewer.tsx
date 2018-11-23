import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from 'react-router';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import ProjectBoard from './ProjectBoard';
import ProjectCustomDragLayer from './ProjectCustomDragLayer';
import TaskForm from '../../component/TaskForm/TaskForm';
import { Task } from '../../model/task';
import Modal from '@material-ui/core/Modal';
//import * as ProjectService from '../../service/ProjectService'

export interface ProjectViewerProps extends RouteComponentProps<any> { }
export interface ProjectViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProjectViewerProps;

class ProjectViewer extends React.Component<MergedProps, ProjectViewerState> {
  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.action.project.loadProject(this.props.match.params.id);
      this.props.action.project.loadTasks(this.props.match.params.id);
    }
  }

  render() {
    const style = { width: '100vw', height: 'calc(100vh - 50px)' };
    const innerHeader = { width: '100vw', height: '30px', backgroundColor: 'lightblue' };
    const innerBody = { width: '100vw', height: 'calc(100% - 30px)', backgroundColor: 'ivory' };
    const modalStyle: React.CSSProperties = {
      top: '15vh',
      left: '25vw',
      width: '50vw',
      height: '70vh',
      backgroundColor: 'white',
      position: 'absolute'
    }
    return (
      <div style={style}>
        <div style={innerHeader}>{this.props.project.getProject().get('name')}</div>
        <div style={innerBody}>
          <ProjectBoard></ProjectBoard>
          <ProjectCustomDragLayer />
        </div>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.props.project.isShowTaskModal()}
          onClose={this.handleCloseTaskModal.bind(this)}
        >
          <div style={modalStyle} >
            <TaskForm onSubmit={this.handleSubmitTask.bind(this)} onClose={this.handleCloseTaskModal.bind(this)} />
          </div>
        </Modal>
      </div>
    );
  }

  handleSubmitTask(values: Task) {
    values.projectId = this.props.project.getProject().get('id');
    let boardPos = 10000;
    this.props.project.getTasks()
      .filter(t => !!t && t.statusId === values.statusId)
      .sort(this.taskComparator)
      .forEach(t => {
        if (!t) return;
        const pos = t.boardPos / 2;
        if (boardPos > pos) boardPos = pos;
      });
    values.boardPos = boardPos;
    this.props.action.project.addTask(values);
    this.handleCloseTaskModal();
  }

  handleCloseTaskModal() {
    this.props.action.project.closeTaskModal();
  }

  taskComparator(t1: Task, t2: Task) {
    if (t1.boardPos < t2.boardPos) return -1;
    if (t1.boardPos > t2.boardPos) return 1;
    return 0;
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

const draggable = DragDropContext(HTML5Backend)(ProjectViewer);
export default connect<StateProps, DispatchProps, ProjectViewerProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
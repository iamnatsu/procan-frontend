import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from 'react-router';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import UserSelector from '../../component/UserSelector/UserSelector'
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import ProjectBoard from './ProjectBoard';
import ProjectCustomDragLayer from './ProjectCustomDragLayer';
import TaskForm from '../../component/TaskForm/TaskForm';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { Button, Modal, Avatar, withStyles, StyledComponentProps } from '@material-ui/core';

import { MODAL_STYLE } from '../../config/Style' 
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export interface ProjectViewerProps extends RouteComponentProps<any> { }
export interface ProjectViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProjectViewerProps & StyledComponentProps;

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
    const headerItem: React.CSSProperties = { float: 'left', height: 30, lineHeight: '30px', margin: '0 10px'}
    const innerBody = { width: '100vw', height: 'calc(100% - 30px)', backgroundColor: 'ivory' };
    if (!this.props.classes) return null;

    const projectMap = this.props.project.getProject();
 
    return (
      <div style={style}>
        <div style={innerHeader}>
          <div style={headerItem}>{projectMap.get('name')}</div>
          <div style={headerItem}>{this.renderAvatar(projectMap.get('assignees'))}</div>
          <Button classes={this.props.classes} onClick={this.handleOpenUserSelector.bind(this)}>+</Button>
        </div>
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
          <div style={MODAL_STYLE} >
            <TaskForm onSubmit={this.handleSubmitTask.bind(this)} onClose={this.handleCloseTaskModal.bind(this)} />
          </div>
        </Modal>
        <UserSelector />
      </div>
    );
  }

  renderAvatar(assignees: User[]) {
    if (!assignees || assignees.length <=0) return;
    return assignees.map(a => {
      return <Avatar key={a.id} style={{ width: 28, height: 28, float: 'left', fontSize: '16px'}}>{a.name.substr(0, 1)}</Avatar>
    })
  }

  handleOpenUserSelector(event: React.MouseEvent<HTMLInputElement>) {
    this.props.action.userSelector.show(event.target as any, this.handleUserSelect.bind(this));
  }

  handleUserSelect(users: { [id: string]: User }) {
    const project: Project = this.props.project.getProject().toJS();
    if (!project.assignees) project.assignees = [];
    Object.keys(users).forEach(k => {
      if(project.assignees.filter(a => a.id === users[k].id).length <= 0) {
        project.assignees.push(users[k]);
      }
    });
    this.props.action.project.updateProject(project);
  }

  handleSubmitTask(values: Task) {
    if (!values.id) {
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
    } else {
      this.props.action.project.updateTask(values);
    }
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
}

interface DispatchProps {
  action: {
    project: ProjectDispatcher,
    userSelector: UserSelectorDispatcher
  };
}

function mapStateToProps(state: AppState) {
  return {
    project: state.project,
    userSelector: state.component.userSelector
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      project: new ProjectDispatcher(dispatch),
      userSelector: new UserSelectorDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectViewerProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  root: {
    minHeight: '30px',
    height: '30px',
    minWidth: '30px',
    width: '30px',
    borderRadius: '15px',
    padding: 0,
    lineHeight: 1
  }
}
const styled = withStyles(styles)(ProjectViewer)
const draggable = DragDropContext(HTML5Backend)(styled);
export default connect<StateProps, DispatchProps, ProjectViewerProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { RouteComponentProps } from 'react-router';
import { P_RED, P_IVORY, WHITE } from '../../config/Color';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import UserSelector from '../../component/UserSelector/UserSelector'
import UserCard from '../../component/UserCard/UserCard'
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { UserSelectorDispatcher } from '../../redux/component/UserSelector/UserSelectorDispatcher';
import { UserCardDispatcher } from '../../redux/component/UserCard/UserCardDispatcher';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import ProjectBoard from './ProjectBoard';
import ProjectCustomDragLayer from './ProjectCustomDragLayer';
import TaskForm from '../../component/TaskForm/TaskForm';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { Button, Modal, Avatar, withStyles, StyledComponentProps } from '@material-ui/core';
import { getFormValues } from 'redux-form/immutable';
import { TaskFormState } from 'src/redux/component/TaskForm/TaskFormReducer';
import * as Tasks from '../../util/tasks';

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
    const innerHeader = { width: '100vw', height: '30px', backgroundColor: P_RED, color: WHITE };
    const headerItem: React.CSSProperties = { float: 'left', height: 30, lineHeight: '30px', margin: '0 10px'}
    const innerBody = { width: '100vw', height: 'calc(100% - 30px)', backgroundColor: P_IVORY };
    if (!this.props.classes) return null;

    const projectMap = this.props.project.getProject();
 
    return (
      <div className="main-contents">
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
        <UserCard />
      </div>
    );
  }

  renderAvatar(assignees: User[]) {
    if (!assignees || assignees.length <= 0) return;
    const style: React.CSSProperties = { width: 28, height: 28, float: 'left', fontSize: '16px', cursor: 'pointer', top: '1px' };
    return assignees.map(a => {
      return <Avatar key={a.id} style={style} 
        onClick={((e: React.MouseEvent<HTMLInputElement>) => { this.handleOpenUserCard(e, a)}).bind(this)}>
          { a && a.name ? a.name.substr(0, 1) : '?' }</Avatar>
    })
  }

  handleOpenUserCard(event: React.MouseEvent<HTMLInputElement>, user: User) {
    this.props.action.userCard.show(event.target as any, user, this.unAssign.bind(this));
  }

  unAssign(user: User) {
    const project: Project = this.props.project.getProject().toJS();
    if (!project.assignees) return;

    const i = project.assignees.findIndex(a => a.id === user.id);
    project.assignees.splice(i, 1);
    this.props.action.project.updateProject(project);
  }

  handleOpenUserSelector(event: React.MouseEvent<HTMLInputElement>) {
    this.props.action.userSelector.show(event.target as any, this.assign.bind(this));
  }

  assign(users: { [id: string]: User }) {
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
    this.props.action.project.closeTaskModal();
  }

  handleCloseTaskModal() {
    if (!Tasks.equals(this.props.taskForm.getTask().toJS(), this.props.values)) {
      this.handleSubmitTask(this.props.values);
    } else {
      this.props.action.project.closeTaskModal();
    }
  }

  taskComparator(t1: Task, t2: Task) {
    if (t1.boardPos < t2.boardPos) return -1;
    if (t1.boardPos > t2.boardPos) return 1;
    return 0;
  }
}


interface StateProps {
  values: Task,
  project: ProjectState,
  taskForm: TaskFormState
}

interface DispatchProps {
  action: {
    project: ProjectDispatcher,
    userSelector: UserSelectorDispatcher,
    userCard: UserCardDispatcher
  };
}

function mapStateToProps(state: AppState) {
  return {
    values: getFormValues('$procan-form/task_form')(state) as Task,
    project: state.project,
    userSelector: state.component.userSelector,
    taskForm: state.component.taskForm
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      project: new ProjectDispatcher(dispatch),
      userSelector: new UserSelectorDispatcher(dispatch),
      userCard: new UserCardDispatcher(dispatch),
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
    color: WHITE,
    borderRadius: '15px',
    border: 'solid 2px rgba(0, 0, 0, 0.1)',
    padding: 0,
    lineHeight: 1
  }
}
const styled = withStyles(styles)(ProjectViewer)
const draggable = DragDropContext(HTML5Backend)(styled);
export default connect<StateProps, DispatchProps, ProjectViewerProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
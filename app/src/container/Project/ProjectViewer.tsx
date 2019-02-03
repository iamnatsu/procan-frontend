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
import { AppBarDispatcher } from '../../redux/component/AppBar/AppBarDispatcher';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import ProjectBoard from './ProjectBoard';
import ProjectCustomDragLayer from './ProjectCustomDragLayer';
import TaskForm from '../../component/TaskForm/TaskForm';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import { Button, Modal, Avatar, Popover, withStyles, StyledComponentProps, TextField, IconButton } from '@material-ui/core';
import { getFormValues } from 'redux-form/immutable';
import { TaskFormState } from 'src/redux/component/TaskForm/TaskFormReducer';
import * as Tasks from '../../util/tasks';

import { MODAL_STYLE } from '../../config/Style' 
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { default as CustomScrollbars } from 'react-custom-scrollbars';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewGanttIcon from '@material-ui/icons/Notes';
import { ViewMode } from '../../model/common';
import { MessageDialogActionMap } from '../../redux/component/MessageDialog/MessageDialogStore';
import * as TaskService from '../../service/TaskService';
import AddIcon from '@material-ui/icons/AddCircle';
import ProjectGantt from './ProjectGantt';

export interface ProjectViewerProps extends RouteComponentProps<any> { }
export interface ProjectViewerState extends React.Props<any> { }

type MergedProps = StateProps & DispatchProps & ProjectViewerProps & StyledComponentProps;

class ProjectViewer extends React.Component<MergedProps, ProjectViewerState> {
  componentWillMount() {
    if (this.props.match.params.id) {
      const localId = this.props.project.getProject().get('id')
      if (this.props.match.params.id != localId) this.props.action.project.loadProject(this.props.match.params.id);
      const tasks = this.props.project.getAllTasks().toJS();
      if (!tasks || tasks.length <= 0 || tasks[0].projectId != this.props.match.params.id) {
        this.props.action.project.loadTasks(this.props.match.params.id);
      }
    }
    this.props.action.appBar.update({ isShowSearch: true, searchAction: this.search.bind(this)});
  }

  componentWillUnmount() {
    this.props.action.appBar.update({ isShowSearch: false, searchAction: () => {}});
  }

  search(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === 13) {
      const word = event.currentTarget.value;
      if (event.currentTarget.value) {
        const tasks: Task[] = this.props.project.getAllTasks().toJS() || [];
        this.props.action.project.updateTasks(
          tasks.filter(t => t.name && t.name.indexOf(word) >= 0)
        );
      } else {
        this.props.action.project.loadTasks(this.props.match.params.id);
      }
    }
  }

  render() {
    if (!this.props.classes) return null;

    const innerHeader = { width: '100vw', height: '30px', backgroundColor: P_RED, color: WHITE };
    const headerItem: React.CSSProperties = { float: 'left', height: 30, lineHeight: '30px', margin: '0 10px'}
    const innerBody = { width: '100vw', height: 'calc(100% - 30px)', backgroundColor: P_IVORY };
    const viewMode = this.props.project.getViewMode();
    const projectMap = this.props.project.getProject();
 
    return (
      <div className="main-contents">
        <div style={innerHeader}>
          <div style={headerItem}>{projectMap.get('name')}</div>
          <div style={headerItem}>{this.renderAvatar(projectMap.get('assignees'))}</div>
          <IconButton aria-label="Clear" className={this.props.classes.addCircle} onClick={this.handleOpenUserSelector.bind(this)}>
            <AddIcon />
          </IconButton>
          { viewMode === ViewMode.KANBAN && <Button className={this.props.classes.viewChanger} onClick={this.changeViewMode.bind(this)}><ViewGanttIcon />GANTT</Button> }
          { viewMode === ViewMode.GANTT && <Button className={this.props.classes.viewChanger} onClick={this.changeViewMode.bind(this)}><ViewColumnIcon />KANBAN</Button> }
        </div>
        <div style={innerBody}>
          { viewMode === ViewMode.KANBAN && <ProjectBoard></ProjectBoard> }
          { viewMode === ViewMode.GANTT && <ProjectGantt/> }
          <ProjectCustomDragLayer />
        </div>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.props.project.isShowTaskModal()}
          onClose={this.handleCloseTaskModal.bind(this)}
        >
          <div style={MODAL_STYLE} >
            <CustomScrollbars>
              <TaskForm onSubmit={this.handleSubmitTask.bind(this)} onDelete={this.deleteTaskConfirm.bind(this)} onClose={this.handleCloseTaskModal.bind(this)} />
            </CustomScrollbars>
          </div>
        </Modal>
        <UserSelector />
        <UserCard />

        <Popover
          classes={{
            paper: this.props.classes.paper
          }}
          id="simple-popper"
          open={!!this.props.project.getPopOverTarget()}
          onClose={this.handleClosePopOver.bind(this)}
          anchorEl={this.props.project.getPopOverAnchor()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          >
          <div>
            <TextField onChange={((event: React.KeyboardEvent<HTMLInputElement>) => {
              this.props.action.project.updatePopOverValue(event.currentTarget.value)
            }).bind(this)} value={this.props.project.getPopOverValue()} fullWidth></TextField>
            <Button onClick={(() => {
              const action = this.props.project.getPopOverAction();
              if (action) action(this.props.project.getPopOverValue());
              this.props.action.project.closePopOver();
            }).bind(this)} color='primary' style={{position: 'absolute', bottom: '5px', right: '5px'}}>OK</Button>
          </div>
        </Popover>
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
    if (!values.name) {
      this.props.action.project.closeTaskModal();
      return;
    }
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

  changeViewMode() {
    const viewMode = this.props.project.getViewMode()
    if (viewMode === ViewMode.KANBAN) {
      this.props.action.project.updateViewMode(ViewMode.GANTT);
    } else {
      this.props.action.project.updateViewMode(ViewMode.KANBAN);
    }
  }

  taskComparator(t1: Task, t2: Task) {
    if (t1.boardPos < t2.boardPos) return -1;
    if (t1.boardPos > t2.boardPos) return 1;
    return 0;
  }

  deleteTaskConfirm(taskId: string) {
    this.deleteConfirm(
      { delete: {
        action: () => {
          TaskService.del(taskId).then(res => {
            this.props.action.messageDialog.closeMessage();
            const index = this.props.project.getTasks().findIndex(t => !!t && t.id === taskId);
            if (index >= 0) {
              const removed = this.props.project.getTasks().remove(index);
              this.props.action.project.updateTasks(removed.toJS());
            }
            this.props.action.project.closeTaskModal();
          });
        },
        caption: 'DELETE',
        color: 'secondary'
      }}
    )
  }

  deleteConfirm(actionMap: MessageDialogActionMap) {
    this.props.action.messageDialog.showMessage('削除してもよろしいですか？', 
      [{ message: 'この操作は取り消すことができません。' }],
      () => { /* NOP */ },
      actionMap
    );
  }

  handleClosePopOver() {
    this.props.action.project.closePopOver();
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
    userCard: UserCardDispatcher,
    messageDialog: MessageDialogDispatcher,
    appBar: AppBarDispatcher,
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
      appBar: new AppBarDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectViewerProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  viewChanger: {
    minHeight: '30px',
    height: '30px',
    position: 'absolute',
    right: '10px',
    color: WHITE,
    padding: '0 10px',
    lineHeight: 1
  },
  paper: {
    minWidth: 250,
    maxWidth: 250,
    minHeight: 100,
  },
  addCircle: {
    padding: '3px',
    color: 'white'
  }
}
const styled = withStyles(styles)(ProjectViewer)
const draggable = DragDropContext(HTML5Backend)(styled);
export default connect<StateProps, DispatchProps, ProjectViewerProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
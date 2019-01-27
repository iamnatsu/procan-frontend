import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { TaskFormState } from '../../redux/component/TaskForm/TaskFormReducer';
import { TaskFormDispatcher } from '../../redux/component/TaskForm/TaskFormDispatcher';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,
  DropTargetCollector, DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget, DropTargetSpec, ConnectDragPreview } from 'react-dnd';
  import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from '../../config/DnDItemType';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { default as CustomScrollbars } from 'react-custom-scrollbars';
import TaskCard from '../../component/Task/TaskCard';
import { Task } from '../../model/task';
import { Iterable } from 'immutable';
import * as TaskService from '../../service/TaskService';
import { PopOverTarget } from '../../model/common';
import { Project } from 'src/model/project';

export interface ProjectStatusProps { 
  id: string;
  name: string;
  pos: number;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  connectDragPreview?: ConnectDragPreview;
  isOver?: boolean;
  isDragging?: boolean;
  handleMoveStatus?: (dragId: string, hoveId: string) => void;
}
export interface ProjectStatusState {
}

type MergedProps = StateProps & DispatchProps & ProjectStatusProps & StyledComponentProps;

class ProjectStatus extends React.Component<MergedProps, ProjectStatusState> {
  private lastHoverTime: number;

  shouldComponentUpdate(nextProps: ProjectStatusProps, nextState: ProjectStatusState) {
    return true;
    /*
    return this.props.id != nextProps.id ||
      this.props.name != nextProps.name ||
      this.props.pos != nextProps.pos;
      */
  }

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
	}

  addTask = () => {
    const task = new Task();
    task.statusId = this.props.id;
    this.props.action.taskForm.updateTask(task)
    this.props.action.project.showTaskModal();
  };

  handleProfileMenuOpen = (event: any) => {
    this.props.action.project.showStatusMenu(event.currentTarget, this.props.pos);
  };

  render() {
    const { connectDropTarget, connectDragSource, connectDragPreview } = this.props;
    if (!connectDropTarget || !connectDragSource || !connectDragPreview) return null;
    const isMenuOpen = this.props.pos === this.props.project.getMenuAnchorPos() && !!this.props.project.getMenuAnchor();
    const renderMenu = (
      <Menu
        anchorEl={this.props.project.getMenuAnchor()}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleOpenStatusPopOver.bind(this)}>ステータス名編集</MenuItem>
        <MenuItem onClick={this.addTask.bind(this)}>タスク追加</MenuItem>
      </Menu>
    );

    const style: React.CSSProperties = { width: '250px', height: 'calc(100vh - 100px)', backgroundColor: 'gainsboro', color: 'rgba(0, 0, 0, 0.87)',
            borderRadius: '3px', margin: '10px 5px', float: 'left', opacity: this.props.isDragging ? 0.5 : 1 };

    const handleStyle: React.CSSProperties  = { backgroundColor: 'lightgray', margin: '10px', width: 'calc(100% - 56px)', height: '24px', fontSize:'14px',
            borderRadius: '3px', padding:'5px', float: 'left', cursor: 'move', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'};
    return <MuiThemeProvider theme={muiTheme}>{connectDropTarget(
      <div style={style}>
        {connectDragSource(<div style={handleStyle}>{ this.props.name }</div>)}
        <div>
          <IconButton
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup='true'
            // onClick={this.handleProfileMenuOpen}
            onClick={this.handleProfileMenuOpen}
            color='inherit'
          >
            <MoreVert />
          </IconButton>
        </div>
        <div style={{clear: 'both', height: 'calc(100vh - 150px)', width: 'calc(100% - 10px)'}}>
          <CustomScrollbars style={{ width: '100%', height: '100%', margin: '5px' }}>
            {this.renderTasks()}
          </CustomScrollbars>  
        </div>
      </div>
    )}{renderMenu}</MuiThemeProvider>;
  }

  renderTasks() {
    const sorted = this.props.project.getTasks()
      .filter(t => !!t && t.statusId === this.props.id)
      .sort(this.taskComparator);

    if (sorted && sorted.size > 0) {
      return sorted.map((t, index) => {
        if (t) {
          return <TaskCard key={t.id} id={t.id} name={t.name} statusId={this.props.id} pos={t.boardPos}
            expectedEndDay={t.expectedEndDay} assignees={t.assignees} progress={t.progress}
            beforePos={this.getBeforePos(t, sorted, index)} nextPos={this.getNextPos(t, sorted, index)}
            handleMoveTask={this.handleMoveTask.bind(this)} handleSaveTask={this.handleSaveTask.bind(this)}
            lastHover={this.lastHover.bind(this)}></TaskCard>
        } else {
          return null;
        } 
      }).toArray();
    } else {
      return <TaskCard key={'$dummy' + this.props.id} id={'$dummy'} statusId={this.props.id} name={'$dummy'} 
        nextPos={10000} handleMoveTask={this.handleMoveTask.bind(this)} handleSaveTask={this.handleSaveTask.bind(this)}
        lastHover={this.lastHover.bind(this)}></TaskCard>
    }
  }

  handleMoveTask(srcTaskId: string, distStatusId: string, distBoardPos: number) {
    const targetTask = this.props.project.getTasks().find(t => !!t && t.id === srcTaskId);
    if (!targetTask) return;

    targetTask.statusId = distStatusId;
    targetTask.boardPos = distBoardPos;

    this.props.action.project.updateTasks(this.props.project.getTasks().toJS());
  }

  handleSaveTask(id: string) {
    const targetTask = this.props.project.getTasks().find(t => !!t && t.id === id);
    if (!targetTask) return;
    TaskService.put(targetTask);
  }

  lastHover(time: number) {
    if (time) {
      this.lastHoverTime = time;
      return time;
    } else {
      return this.lastHoverTime;
    }
  }

  taskComparator(t1: Task, t2: Task) {
    if (t1.boardPos < t2.boardPos) return -1;
    if (t1.boardPos > t2.boardPos) return 1;
    return 0;
  }

  getNextPos(task: Task, sortedTasks: Iterable<number, Task>, index: number | undefined) {
    const nextTask = index || index === 0 ? sortedTasks.get(index + 1) : null;
    if (nextTask) {
      const diff = nextTask.boardPos - task.boardPos;
      const tmp = task.boardPos + (diff / 2);
      if (diff >= 3) {
        return Math.round(tmp);
      } else {
        return tmp;
      }
    } else {
      return task.boardPos + 100;
    }
  }

  getBeforePos(task: Task, sortedTasks: Iterable<number, Task>, index: number | undefined) {
    if (!index) return task.boardPos >=3 ? Math.round(task.boardPos / 2) : task.boardPos / 2;

    const nextTask = sortedTasks.get(index - 1);
    if (nextTask) {
      const diff = nextTask.boardPos - task.boardPos;
      const tmp = task.boardPos + (diff / 2);
      if (diff >= 3) {
        return Math.round(tmp);
      } else {
        return tmp;
      }
    }
  }

  handleOpenStatusPopOver = (event: any) => {
    this.props.action.project.showPopOver(PopOverTarget.STATUS_NAME, event.currentTarget
        , this.props.name, this.updateStatusName.bind(this))
    this.props.action.project.closeStatusMenu();
  };

  handleMenuClose = (event: any) => {
    this.props.action.project.closeStatusMenu();
  };

  updateStatusName(value: string) {
    if (!value) return;
    const project: Project = this.props.project.getProject().toJS();
    const status = project.statuses.find(s => s.id === this.props.id);
    if (status) {
      status.name = value;
      this.props.action.project.updateProject(project);
    }
  }
}


interface StateProps {
  project: ProjectState;
  taskForm: TaskFormState;
}

interface DispatchProps {
  action: {
    project: ProjectDispatcher,
    taskForm: TaskFormDispatcher
  };
}

function mapStateToProps(state: AppState) {
  return { 
    project: state.project,
    taskForm: state.component.taskForm
   };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      project: new ProjectDispatcher(dispatch),
      taskForm: new TaskFormDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectStatusProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const statusSource: DragSourceSpec<ProjectStatusProps, any> = {
  beginDrag(props, monitor: DragSourceMonitor, component) {
    return props;
  },

  endDrag(props, monitor: DragSourceMonitor, component) {
    return;
  }
};

interface DragProps {
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}
interface DropProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  itemType: string | symbol | null;
}
const dragCollect: DragSourceCollector<DragProps> = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}
const dropCollect: DropTargetCollector<DropProps> = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    itemType: monitor.getItemType()
  }
}
const dropTarget: DropTargetSpec<any> = {
  hover(props: ProjectStatusProps, monitor: DropTargetMonitor, component: ProjectStatus | null) {
		if (!component) {
			return null;
    }
    const item = monitor.getItem();
    if (!item || !props) {
      return null;
    }
		const dragId = monitor.getItem().id;
		const hoverId = props.id;
		if (dragId === hoverId) {
			return;
		}
		if (props.handleMoveStatus) props.handleMoveStatus(dragId, hoverId);
  },

  drop(props: ProjectStatusProps, monitor: any) {
    return;
  }
};

const muiTheme = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        marginTop: '4px',
        padding: '6px'
      }
    },
    MuiSvgIcon: {
      root: {
        fontSize: '20px'
      }
    }
  }
});

const connected = DropTarget<ProjectStatusProps>([ItemTypes.STATUS], dropTarget, dropCollect)(DragSource<ProjectStatusProps>(ItemTypes.STATUS, statusSource, dragCollect)(ProjectStatus));
export default connect<StateProps, DispatchProps, ProjectStatusProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(connected);

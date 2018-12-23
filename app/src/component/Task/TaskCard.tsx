import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { TaskFormDispatcher } from '../../redux/component/TaskForm/TaskFormDispatcher';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,
  DropTargetCollector, DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget, DropTargetSpec, ConnectDragPreview } from 'react-dnd';
  import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from '../../config/DnDItemType';
//import { Task } from '../../model/task';
import * as TaskService from '../../service/TaskService';

/*
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { default as CustomScrollbars } from 'react-custom-scrollbars';
*/

export interface TaskCardProps { 
  id: string;
  name: string;
  statusId: string;
  pos?: number;
  nextPos: number;
  beforePos?: number;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  connectDragPreview?: ConnectDragPreview;
  isOver?: boolean;
  isDragging?: boolean;
  draggingItemId?: string;
  handleMoveTask: (srcTaskId: string, distStatusId: string, distBoardPos: number) => void;
}
export interface TaskCardState {
  anchorEl: HTMLAnchorElement | null;
}

type MergedProps = StateProps & DispatchProps & TaskCardProps & StyledComponentProps;

class TaskCard extends React.Component<MergedProps, TaskCardState> {
  constructor(props: MergedProps) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }
  shouldComponentUpdate(nextProps: TaskCardProps, nextState: TaskCardState) {
    return true;
  }

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
	}

  componentWillMount() {
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  addTask = () => {
    this.setState({ anchorEl: null });
  };

  handleProfileMenuOpen = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { connectDropTarget, connectDragSource, connectDragPreview } = this.props;
    if (!connectDropTarget || !connectDragSource || !connectDragPreview) return null;

    const style: React.CSSProperties = { width: '225px', height: '100px', backgroundColor: 'white', color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
            padding: '5px',
            borderRadius: '3px', margin: '10px 5px', opacity: this.props.isDragging || this.props.draggingItemId == this.props.id ? 0.3 : 1 };
    if (this.props.id === '$dummy') {
      style.backgroundColor= 'lightgray';
      style.height = 'calc(100% - 20px)';
      style.boxShadow = 'none';
      return connectDropTarget(<div style={style}></div>);
    }
/*
    const handleStyle: React.CSSProperties  = { backgroundColor: 'lightgray', margin: '10px', width: 'calc(100% - 56px)', height: '24px', fontSize:'14px',
            borderRadius: '3px', padding:'5px', float: 'left', cursor: 'move', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'};
            */
    return connectDropTarget(
      connectDragSource(<div className="task-card" onClick={this.handleClick.bind(this)} style={style}>
        {this.props.name + ':' + this.props.beforePos+ ':' + this.props.pos+ ':' + this.props.nextPos}</div>));
  }

  handleClick() {
    TaskService.get(this.props.id).then(res => {
      this.props.action.taskForm.updateTask(res.data);
      this.props.action.project.showTaskModal();
    });
  }
}


interface StateProps {
  project: ProjectState;
  messageDialog: MessageDialogState;
}

interface DispatchProps {
  action: {
    project: ProjectDispatcher,
    taskForm: TaskFormDispatcher,
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
      taskForm: new TaskFormDispatcher(dispatch),
      messageDialog: new MessageDialogDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: TaskCardProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const statusSource: DragSourceSpec<TaskCardProps, any> = {
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
    isDragging: monitor.isDragging(),
    draggingItemId: monitor.getItem() ? monitor.getItem().id : ''
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
  hover(props: MergedProps, monitor: DropTargetMonitor, component: TaskCard | null) {
		if (!component) {
			return null;
    }
    
    if (!monitor.getItem() || !props) {
      return null;
    }
		const dragId = monitor.getItem().id;
		const hoverId = props.id;
		if (dragId === hoverId) {
			return;
    }

    const item = props.project.getTasks().find(t => !!t && t.id === dragId);
    if (!item) return;

    
    if (item.boardPos > props.nextPos && props.beforePos && item.statusId == props.statusId) {
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
    } else if (props.beforePos && item.statusId != props.statusId) {
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
    } else {
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.nextPos);
    }
    

  },

  drop(props: TaskCardProps, monitor: any) {
    return;
  }
};

const connected = DropTarget<TaskCardProps>([ItemTypes.TASK], dropTarget, dropCollect)(DragSource<TaskCardProps>(ItemTypes.TASK, statusSource, dragCollect)(TaskCard));
export default connect<StateProps, DispatchProps, TaskCardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(connected);

import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import { TASK_CARD } from '../../config/Style'
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { TaskFormDispatcher } from '../../redux/component/TaskForm/TaskFormDispatcher';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,
  DropTargetCollector, DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget, DropTargetSpec, ConnectDragPreview } from 'react-dnd';
  import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from '../../config/DnDItemType';
import * as TaskService from '../../service/TaskService';

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
  handleSaveTask: (id: string) => void;
  lastHover?: (time?: number) => number;
}
export interface TaskCardState {
}

type MergedProps = StateProps & DispatchProps & TaskCardProps & StyledComponentProps;

class TaskCard extends React.Component<MergedProps, TaskCardState> {
  
  constructor(props: MergedProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: TaskCardProps, nextState: TaskCardState) {
//    return true;
    return this.props.id != nextProps.id ||
      this.props.name != nextProps.name ||
      this.props.statusId != nextProps.statusId ||
      this.props.pos != nextProps.pos || 
      this.props.isOver != nextProps.isOver || 
      this.props.isDragging != nextProps.isDragging ||
      this.props.draggingItemId != nextProps.draggingItemId 
      ;   
  }

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
	}

  componentWillMount() {
  }

  render() {
    const { connectDropTarget, connectDragSource, connectDragPreview } = this.props;
    if (!connectDropTarget || !connectDragSource || !connectDragPreview) return null;

    const style = Object.assign({}, TASK_CARD);
    if (this.props.isDragging || this.props.draggingItemId == this.props.id) style.opacity = 0.3;
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
      connectDragSource(<div id={"task-card-" + this.props.id} className="task-card" onClick={this.handleClick.bind(this)} style={style}>
        {this.props.name}</div>));
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
			return null;
    }

    const item = props.project.getTasks().find(t => !!t && t.id === dragId);
    if (!item) {
			return null;
    }

    const time = new Date().getTime();
    if (item.boardPos > props.nextPos && props.beforePos && item.statusId == props.statusId) {
      if (props.lastHover && time - props.lastHover() < 100) {
        // パフォーマンスのため、短時間での移動は無視
        return;
      } else if (props.lastHover) {
        props.lastHover(time);
      }
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
    } else if (props.beforePos && item.statusId != props.statusId) {
      if (props.lastHover && time - props.lastHover() < 100) {
        return;
      } else if (props.lastHover) {
        props.lastHover(time);
      }
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
    } else {
      if (props.lastHover && time - props.lastHover() < 100) {
        return;
      } else if (props.lastHover) {
        props.lastHover(time);
      }
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.nextPos);
    }

  },

  drop(props: TaskCardProps, monitor: any) {
    props.handleSaveTask(props.id);
  }
};

const connected = DropTarget<TaskCardProps>([ItemTypes.TASK], dropTarget, dropCollect)(DragSource<TaskCardProps>(ItemTypes.TASK, statusSource, dragCollect)(TaskCard));
export default connect<StateProps, DispatchProps, TaskCardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(connected);

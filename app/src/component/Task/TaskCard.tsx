import * as React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom'
import { XYCoord } from 'dnd-core'
import { AppState } from '../../redux/index';
import * as moment from 'moment';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import { TASK_CARD } from '../../config/Style'
import { User } from '../../model/user'
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { MessageDialogState } from '../../redux/component/MessageDialog/MessageDialogReducer';
import { MessageDialogDispatcher } from '../../redux/component/MessageDialog/MessageDialogDispatcher';
import { TaskFormDispatcher } from '../../redux/component/TaskForm/TaskFormDispatcher';
import { UserCardDispatcher } from '../../redux/component/UserCard/UserCardDispatcher';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,
  DropTargetCollector, DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget, DropTargetSpec, ConnectDragPreview } from 'react-dnd';
  import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from '../../config/DnDItemType';
import * as TaskService from '../../service/TaskService';
import { Avatar } from '@material-ui/core';
import { P_LIGHT_LIGHT_BLUE } from '../../config/Color';

export interface TaskCardProps { 
  id: string;
  name: string;
  statusId: string;
  pos?: number;
  assignees?: User[];
  expectedEndDay?: Date;
  progress?: number;
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
      this.props.progress != nextProps.progress ||
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
    } else if (this.props.progress) {
      style.background = `linear-gradient(90deg,${P_LIGHT_LIGHT_BLUE} 0%,${P_LIGHT_LIGHT_BLUE} ${this.props.progress}%,white ${this.props.progress}%,white 100%)`
    }
    return connectDropTarget(connectDragSource(this.renderTask(style)));
  }

  renderTask(style: React.CSSProperties) {
    return <div className="task-card" 
        onClick={this.handleClick.bind(this)}
        style={style}>
        <div>{this.props.name}</div>
        {this.renderAvatar()}
        {this.renderExpectedEndDay()}
      </div>
  }

  renderAvatar() {
    if (!this.props.assignees || this.props.assignees.length <= 0) return null;

    const padding = 28 * (7 - this.props.assignees.length) + 17;
    return <div style={{height: '30px', width: '215px', paddingLeft: padding + 'px'}}>
        {this.renderAvatars()}
      </div>;
  }

  renderAvatars() {
    if (!this.props.assignees || this.props.assignees.length <= 0) return null;
    const styleEtc: React.CSSProperties = { width: 28, height: 28, float: 'left', fontSize: '12px', top: '1px' };
    const style: React.CSSProperties = { width: 28, height: 28, float: 'left', fontSize: '16px', cursor: 'pointer', top: '1px' };
    return this.props.assignees.map((a, i) => {
      if (i === 6 && this.props.assignees) {
        return <Avatar key={a.id} style={styleEtc}>+{ this.props.assignees.length - 6 }</Avatar>
      }
      if (i > 6) return null;

      return <Avatar key={a.id} style={style} 
        onClick={((e: React.MouseEvent<HTMLInputElement>) => { this.handleOpenUserCard(e, a)}).bind(this)}>
          { a && a.name ? a.name.substr(0, 1) : '?' }</Avatar>
    })
  }

  handleOpenUserCard(event: React.MouseEvent<HTMLInputElement>, user: User) {
    event.stopPropagation();
    this.props.action.userCard.show(event.target as any, user);
    //
  }

  renderExpectedEndDay() {
    if (this.props.expectedEndDay) {
      return <div style={{height: '16px', fontSize: '12px', color: 'rgba(0, 0, 0, 0.65)', textAlign: 'right'}}>
          {moment(this.props.expectedEndDay).format('YYYY/MM/DD')}
        </div>
    } else {
      return null;
    }
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
    userCard: UserCardDispatcher,
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
      userCard: new UserCardDispatcher(dispatch),
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
    if (props.lastHover && time - props.lastHover() < 100) {
      // パフォーマンスのため、短時間での移動は無視
      return;
    }

		const hoverBoundingRect = (findDOMNode(
			component,
    ) as Element).getBoundingClientRect()
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
		const clientOffset = monitor.getClientOffset()
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

    if (item.boardPos > props.nextPos && props.beforePos && item.statusId == props.statusId) {
      if (props.lastHover) {
        props.lastHover(time);
      }
      if (hoverClientY > hoverMiddleY) return;
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
    } else if (item.statusId != props.statusId) {
      if (props.lastHover) {
        props.lastHover(time);
      }
      if (!props.beforePos) {
        if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, 10000);
      } else {
        if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.beforePos);
      }
    } else if(item.boardPos < props.nextPos && props.beforePos && item.statusId == props.statusId) {
      if (props.lastHover) {
        props.lastHover(time);
      }
      if (hoverClientY < hoverMiddleY) return;
      if (props.handleMoveTask) props.handleMoveTask(dragId, props.statusId, props.nextPos);
    }

  },

  drop(props: TaskCardProps, monitor: any) {
    props.handleSaveTask(props.id);
  }
};

const connected = DropTarget<TaskCardProps>([ItemTypes.TASK], dropTarget, dropCollect)(DragSource<TaskCardProps>(ItemTypes.TASK, statusSource, dragCollect)(TaskCard));
export default connect<StateProps, DispatchProps, TaskCardProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(connected);

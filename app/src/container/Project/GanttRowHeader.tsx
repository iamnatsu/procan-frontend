import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'src/redux';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,
  ConnectDragPreview, DropTargetCollector, DropTargetConnector, ConnectDropTarget, DropTargetMonitor, DropTargetSpec,
  DropTarget, XYCoord} from 'react-dnd';
import * as moment from 'moment';
import { ItemTypes } from '../../config/DnDItemType';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Task } from '../../model/task';
import { GanttHeader } from '../../model/common';
import { getWidthByHeader } from '../../container/Project/GanttHelper';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import { Status } from '../../model/status';
import { Avatar } from '@material-ui/core';
import { User } from '../../model/user';
import { GanttState } from '../../redux/Gantt/GanttReducer';
import { findDOMNode } from 'react-dom';
import { P_RED_LIGHT, P_DARK_DARK_BLUE } from '../../config/Color';

export interface GanttRowHeaderProps {
  top: number;
  width: number;
  task: Task;
  index: number;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  connectDragPreview?: ConnectDragPreview;
  isDragging?: string;
  moveRow: (taskId: number, from: number, to: number) => void;
  commitRow: () => void;
  handleNameClick: (taskId: string) => void;
}

export interface GanttRowHeaderState { }

type MergedProps = StateProps & DispatchProps & GanttRowHeaderProps;

class GanttRowHeader extends React.Component<MergedProps, GanttRowHeaderState> {
  static lastHover: number;

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
  }

  render() {
    if (!this.props.connectDragSource || !this.props.connectDropTarget) return null;
    return this.props.connectDropTarget(
      <div className='gantt-row-header' key={this.props.task.id + '-h'} style={{ height: '20px', top: this.props.top + 'px', width: this.props.width + 'px'
        , paddingLeft: '20px', borderBottom: 'solid 1px lightgray', position: 'absolute',
        backgroundColor: this.props.isDragging === this.props.task.id ? P_RED_LIGHT : 'transparent'}} title={this.props.task.name}>
        {this.props.connectDragSource(<div style={{width: '10px', height: '17px', top: '1px', borderRadius: '4px', 
          position: 'absolute', left: '5px', backgroundColor: 'transparent', cursor: 'move'}}>
          {this.dot('1px', '2px')}{this.dot('1px', '8px')}{this.dot('1px', '14px')}
          {this.dot('4px', '2px')}{this.dot('4px', '8px')}{this.dot('4px', '14px')}
        </div>)}
        {this.renderHeaderInner(this.props.task, this.props.index)}
      </div>
    )
  }

  dot(left: string, top: string) {
    return <div style={{width: '2px', height: '2px', borderRadius: '1px', backgroundColor: 'gray', left: left, top: top, position: 'absolute'}}></div>
  }

  renderHeaderInner(task: Task, index: number) {
    const headers = this.props.gantt.getHeaders();
    const cols: JSX.Element[] = [];
    
    headers.map(header => {
      switch (header) {
        case GanttHeader.NAME:
          cols.push(<div key={task.id + '-h-' + index + header} className='gantt-rowheader-name'
            style={{ width: getWidthByHeader(header), fontSize: '12px', color: P_DARK_DARK_BLUE, height: '100%', 
            lineHeight: '20px', float: 'left', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
            cursor: 'pointer', borderRadius: '4px', padding: '0 2px'}} 
            onClick={(() => this.props.handleNameClick(task.id)).bind(this)}>{task.name}</div>);
          break;
        case GanttHeader.ACTUAL_START_DATE:
          cols.push(<div key={task.id + '-h-' + index +  header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
            {task.actualStartDay ? moment(task.actualStartDay).format('YY/MM/DD') : ''}</div>);
          break;
        case GanttHeader.ACTUAL_END_DATE:
          cols.push(<div key={task.id + '-h-' + index +  header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
            {task.actualEndDay ? moment(task.actualEndDay).format('YY/MM/DD') : ''}</div>);
          break;
        case GanttHeader.EXPECTED_START_DATE:
          cols.push(<div key={task.id + '-h-' + index +  header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
            {task.expectedStartDay ? moment(task.expectedStartDay).format('YY/MM/DD') : ''}</div>);
          break;
        case GanttHeader.EXPECTED_END_DATE:
          cols.push(<div key={task.id + '-h-' + index +  header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
            {task.expectedEndDay ? moment(task.expectedEndDay).format('YY/MM/DD') : ''}</div>);
          break;
        case GanttHeader.STATUS:
          cols.push(<div key={task.id + '-h-' + index + header} style={{ width: getWidthByHeader(header), fontSize: '10px',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', height: '100%',lineHeight: '20px', float: 'left'}}>
          {this.getStatusName(task.statusId)}</div>)
          break;
        case GanttHeader.PROGRESS:
            cols.push(<div key={task.id + '-h-' + index + header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
            {task.progress == 100 ? 100 : (task.progress || 0) + '%'}</div>)
          break;
        case GanttHeader.ASSIGNEE:
            cols.push(<div key={task.id + '-h-' + index +  header} style={{ width: getWidthByHeader(header), fontSize: '10px', height: '100%',lineHeight: '20px', float: 'left'}}>
              {task.assignees && task.assignees.length > 0 ? this.renderAvatar(task.assignees[0]): ''}</div>)
          break;
        default: 
            break;
      }
    });
    return cols;
  }

  getStatusName(statusId: string) {
    if (!statusId) return '';
    const statuses: Status[] = this.props.project.getProject().get('statuses');
    if (statuses && statuses.length > 0) {
      const status = statuses.find(s => !!s && s.id == statusId);
      if (status) return status.name || '';
    } else {
      return '';
    }
  }

  renderAvatar(u: User) {
      return <Avatar key={'task-' + u.id} style={{ width: 18, height: 18, top: '1px', float: 'left', fontSize: '14px'}}>
        {u && u.name ? u.name.substr(0, 1) : '?'}</Avatar>
  }
}

export interface StateProps {
  project: ProjectState;
  gantt: GanttState;
}

export interface DispatchProps {
  actions: {
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    project: state.project,
    gantt: state.gantt
  };
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
    }
  };
}

const statusSource: DragSourceSpec<GanttRowHeaderProps, any> = {
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
const dragCollect: DragSourceCollector<DragProps> = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.getItem() && monitor.getItem().task ? monitor.getItem().task.id : '',
  }
}

interface DropProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  itemType: string | symbol | null;
}
const dropCollect: DropTargetCollector<DropProps> = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    itemType: monitor.getItemType()
  }
}
const dropTarget: DropTargetSpec<any> = {
  hover(props: MergedProps, monitor: DropTargetMonitor, component: GanttRowHeader | null) {

    const time = new Date().getTime();
    if (GanttRowHeader.lastHover && time - GanttRowHeader.lastHover < 100) {
      // for performance
      return;
    }
    GanttRowHeader.lastHover = time;

		if (!component) {
			return null;
    }
    
    if (!monitor.getItem() || !props) {
      return null;
    }

		const dragIndex = monitor.getItem().index;
		const dragTaskId = monitor.getItem().task.id;
		const hoverIndex = props.index;
		const hoverTaskId = props.task.id;
		if (dragIndex === hoverIndex && dragTaskId == hoverTaskId ) {
			return null;
    }

    const hoverBoundingRect = (findDOMNode(
			component,
    ) as Element).getBoundingClientRect()
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
		const clientOffset = monitor.getClientOffset()
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

    // Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		props.moveRow(dragTaskId, dragIndex, hoverIndex);
  },

  drop(props: MergedProps, monitor: any) {
    props.commitRow();
  }
};

const draggable = DropTarget<GanttRowHeaderProps>([ItemTypes.GANTT_ROW_HEADER], dropTarget, dropCollect)(DragSource<GanttRowHeaderProps>(ItemTypes.GANTT_ROW_HEADER, statusSource, dragCollect)(GanttRowHeader));
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(draggable);

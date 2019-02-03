import * as React from 'react';
import { Component } from 'react'
import * as moment from 'moment';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource, ConnectDragPreview} from 'react-dnd';
import { ItemTypes } from '../../config/DnDItemType';
import { P_LIGHT_BLUE, P_LIGHT_GANTT_BLUE, P_RED_LIGHT, P_RED, P_GRAY } from '../../config/Color';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Task } from '../../model/task';
import GanttResizer from './GanttResizer'

export interface GanttBarProps {
  left: string;
  top: number;
  width: number;
  height?: string;
  snap: number;
  backgroundColor?: string;
  task: Task;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
  isDragging?: boolean;
}

export interface GanttBarState { }

type MergedProps = GanttBarProps;

class GanttBar extends Component<MergedProps, GanttBarState> {
  static today = moment(new Date());

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
  }

  render() {
    if (!this.props.connectDragSource) return null;
    const progress = this.props.task.progress || 0;
    const isDelayed = this.props.task.expectedEndDay && GanttBar.today.diff(moment(this.props.task.expectedEndDay), 'd') >= 0;
    const h = this.props.height ? this.props.height : '20px';
    const style: CSSProperties = {
      left: this.props.left,
      width: this.props.width + 'px',
      top: this.props.top + 'px',
      height: h,
      fontSize: '12px',
      lineHeight: h,
      padding: '0 5px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      borderRadius: '4px',
      background : this.background(progress, isDelayed),
      position: 'absolute',
      zIndex: 1,
      cursor: 'move',
      opacity: this.props.isDragging ? 0 : 1,
    }
    return this.props.connectDragSource(
      <div style={style}>
      {this.props.task.name}
        <GanttResizer left={this.props.width - 5 + 'px'} height={h} top={this.props.top}
          snap={this.props.snap} task={this.props.task} isDelayed={isDelayed}></GanttResizer>
      </div>
    )
  }

  background(progress: number, isDelayed: boolean) {
    let lightColor = P_LIGHT_GANTT_BLUE;
    let darkColor = P_LIGHT_BLUE;

    if (progress == 100) {
      lightColor = P_GRAY;
      darkColor = P_GRAY;
    } else if (isDelayed) {
      lightColor = P_RED_LIGHT;
      darkColor = P_RED;
    }

    return 'linear-gradient(90deg, ' + darkColor + ' 0%,  ' + darkColor + ' ' + progress + '%, '
    + lightColor + ' ' + progress + '%, ' + lightColor + ' 100%)';
  }
}

const statusSource: DragSourceSpec<GanttBarProps, any> = {
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
    isDragging: monitor.isDragging(),
  }
}

export default DragSource<GanttBarProps>(ItemTypes.GANTT_BAR, statusSource, dragCollect)(GanttBar);

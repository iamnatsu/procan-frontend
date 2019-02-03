import * as React from 'react';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource,/*, ConnectDragPreview*/ 
ConnectDragPreview} from 'react-dnd';
import { ItemTypes } from '../../config/DnDItemType';
import { P_LIGHT_BLUE, P_RED, P_GRAY } from '../../config/Color';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Task } from '../../model/task';

export interface GanttResizerProps {
  left: string;
  height: string;
  top: number;
  snap: number;
  task: Task;
  isDelayed: boolean;
  backgroundColor?: string;
  connectDragSource?: ConnectDragSource;
  connectDragPreview?: ConnectDragPreview;
  isDragging?: boolean;
}

export interface GanttResizerState { }

type MergedProps = GanttResizerProps;

class GanttResizer extends React.Component<MergedProps, GanttResizerState> {

  componentDidMount() {
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }
  }

  render() {
    if (!this.props.connectDragSource) return null;
    return this.props.connectDragSource(
      <div style={{height: this.props.height, width: '5px', left: this.props.left , top: '0px', position: 'absolute',
        cursor: 'pointer', backgroundColor: !this.props.isDragging ? this.background() : 'transparent'}}></div>
    )
  }

  background() {
    const progress = this.props.task.progress || 0;
    let color = P_LIGHT_BLUE;

    if (progress == 100) {
      color = P_GRAY;
    } else if (this.props.isDelayed) {
      color = P_RED;
    }

    return color;
  }
}

const statusSource: DragSourceSpec<GanttResizerProps, any> = {
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

export default DragSource<GanttResizerProps>(ItemTypes.GANTT_RESIZER, statusSource, dragCollect)(GanttResizer);

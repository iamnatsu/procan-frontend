import { DragLayer, DragLayerMonitor } from 'react-dnd';
import * as React from 'react';
import ProjectStatus from './ProjectStatus';
import { ItemTypes } from '../../config/DnDItemType';
import TaskCard from '../../component/Task/TaskCard';
import {  P_LIGHT_GANTT_BLUE, P_BLACK } from '../../config/Color';
import GanttRowHeader from './GanttRowHeader';

function collect(monitor: DragLayerMonitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
	  initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),

    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset(),
    diff: monitor.getDifferenceFromInitialOffset(),

  }
}

function getItemStyles(props: any) {
	const { initialOffset, currentOffset } = props
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		}
	}

	const { x } = currentOffset
	const transform = `translate(${x}px, ${80}px)`
	return {
		transform,
		WebkitTransform: transform,
	}
}

function getItemStylesTask(props: any) {
	const { initialOffset, currentOffset } = props
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		}
	}

	const { x, y } = currentOffset
	const transform = `translate(${x}px, ${y}px)`
	return {
		transform,
		WebkitTransform: transform,
	}
}

function getItemStylesBar(props: any) {
	const { initialOffset, currentOffset } = props
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		}
  }

  let { x, y } = currentOffset
	x -= initialOffset.x
	;[x, y] = snapToGrid(x, y, props.item.snap)
	x += initialOffset.x

	const transform = `translate(${x}px, ${80}px)`
	return {
		transform,
		WebkitTransform: transform,
	}
}

function getItemStylesResizer(props: any) {
	const { initialOffset, currentOffset } = props
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		}
  }

  let { x, y } = currentOffset
	x -= initialOffset.x
	;[x, y] = snapToGrid(x, y, props.item.snap)
	x += initialOffset.x

	const transform = `translate(${x}px, ${120}px)`
	return {
		transform,
		WebkitTransform: transform,
	}
}

function getItemStylesRowHeader(props: any) {
	const { initialOffset, currentOffset } = props
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		}
	}

	const { y } = currentOffset
	const transform = `translate(${0}px, ${y}px)`
	return {
		transform,
		WebkitTransform: transform,
	}
}

function snapToGrid(x: number, y: number, snap: number) {
  const snappedX = Math.round(x / snap) * snap
  const snappedY = Math.round(y / snap) * snap
  return [snappedX, snappedY]
}

interface OwnProps extends React.Props<ProjectCustomDragLayer> {
  item: any;
  itemType?: any;
  currentOffset?: any;
  isDragging?: boolean;
  initialClientOffset?: any;
  clientOffset?: any;
  diff?: any;

}
type ProjectCustomDragLayerProps = OwnProps;

class ProjectCustomDragLayer extends React.Component<ProjectCustomDragLayerProps, any> {
  render() {
    const { isDragging,item, itemType} = this.props;
    if (!isDragging || !item || !itemType) return null;

    if (itemType === ItemTypes.STATUS) {
      return this.status();
    } else if (itemType === ItemTypes.TASK) {
      return this.task();
    } else if (itemType === ItemTypes.GANTT_BODY) {
      return this.empty();
    } else if (itemType === ItemTypes.GANTT_BAR) {
      return this.ganttBar();
    } else if (itemType === ItemTypes.GANTT_RESIZER) {
      return this.ganttResizer();
    } else if (itemType === ItemTypes.GANTT_ROW_HEADER) {
      return this.ganttRowHeader();
    } else {
      return <div></div>
    }
  }

  private status() {
    const { item} = this.props;
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    return (<div style={layerStyles}>
              <div style={getItemStyles(this.props)}><ProjectStatus id={item.id} name={item.name} pos={item.pos} /></div>
            </div>);
  }

  private task() {
    const { item} = this.props;
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    return (<div style={layerStyles}>
              <div style={getItemStylesTask(this.props)}><TaskCard id={item.id} name={item.name} nextPos={item.nextPos} statusId={item.statusId} handleMoveTask={() => {}} handleSaveTask={() => {}}/></div>
            </div>);
  }

  private ganttBar() {
    const { item } = this.props;
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    const style: React.CSSProperties = {
      width: item.width,
      top: item.top + 40 + 'px',
      height: item.height ? item.height : '20px',
      borderRadius: '4px',
      backgroundColor : P_LIGHT_GANTT_BLUE,
      zIndex: 2,
      opacity: 0.5,
      position: 'absolute',
    }
    return <div style={layerStyles}>
        <div style={getItemStylesBar(this.props)}>
          <div style={style}></div>
        </div>
      </div>
  }

  private ganttResizer() {
    const { item } = this.props;
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    const style: React.CSSProperties = {
      width: '5px',
      top: item.top + 'px',
      height: '18px',
      borderRadius: '4px',
      backgroundColor : P_BLACK,
      zIndex: 3,
      position: 'absolute',
    }
    return <div style={layerStyles}>
        <div style={getItemStylesResizer(this.props)}>
          <div style={style}></div>
        </div>
      </div>
  }

  private ganttRowHeader() {
    const { item } = this.props;
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 1000,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }
    return <div style={layerStyles}>
        <div style={getItemStylesRowHeader(this.props)}>
          <GanttRowHeader task={item.task}></GanttRowHeader> 
        </div>
      </div>
  }

  private empty() {
    const layerStyles: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      opacity: 0
    }
    return (<div style={layerStyles}>
              <div></div>
            </div>);
  }
}

export default DragLayer(collect)(ProjectCustomDragLayer);

import { DragLayer, DragLayerMonitor } from 'react-dnd';
import * as React from 'react';
import ProjectStatus from './ProjectStatus';
import { ItemTypes } from '../../config/DnDItemType';
import TaskCard from '../../component/Task/TaskCard';

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
    }
  }

  status() {
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

  task() {
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
              <div style={getItemStylesTask(this.props)}><TaskCard id={item.id} name={item.name} nextPos={item.nextPos} statusId={item.statusId} handleMoveTask={() => {}}/></div>
            </div>);
  }
}

export default DragLayer(collect)(ProjectCustomDragLayer);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import { withStyles, StyledComponentProps, Avatar, IconButton, Popover, Switch, FormControlLabel } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import * as moment from 'moment';
import { P_IVORY } from '../../config/Color';
import Scrollbars, { default as CustomScrollbars, ScrollbarProps } from 'react-custom-scrollbars';
import { GanttState } from '../../redux/Gantt/GanttReducer';
import { GanttDispatcher } from '../../redux/Gantt/GanttDispatcher';
import { ProjectState } from '../../redux/Project/ProjectReducer';
import GanttBar from '../../component/Gantt/GanttBar';
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceCollector, DragSourceConnector, ConnectDragSource, 
ConnectDragPreview, DropTargetCollector, ConnectDropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec, DropTarget} from 'react-dnd';
import { ItemTypes } from '../../config/DnDItemType';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Task } from '../../model/task';
import { ProjectDispatcher } from '../../redux/Project/ProjectDispatcher';
import { dayStyle, monStyle, weekStyle, getWidthByHeader } from './GanttHelper';
import { User } from '../../model/user';
import { GanttHeader } from '../../model/common';
import SettingsIcon from '@material-ui/icons/Settings';
import GanttRowHeader from './GanttRowHeader';
import { TaskFormDispatcher } from '../../redux/component/TaskForm/TaskFormDispatcher';
import * as TaskService from '../../service/TaskService';
import * as ProjectService from '../../service/ProjectService';
import { Project } from '../../model/project';

export interface ProjectGanttProps { 
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  connectDragPreview?: ConnectDragPreview;
  isDragging?: boolean;
}
export interface ProjectGanttState { }

type MergedProps = StateProps & DispatchProps & ProjectGanttProps & StyledComponentProps & ScrollbarProps;

class ProjectGantt extends React.Component<MergedProps, ProjectGanttState> {
  private static CalenderHeight = '40px';
  private static weekOrDayThreshold = 18;
  static startLeft = 0;
  static startTop = 0;
  static beforeResizerOffset = 0;

  componentWillMount() {
    this.props.action.gantt.updateLeft(200);
    this.props.action.gantt.updateWidth(window.parent.screen.width + 400);
    const startDay = moment().subtract(Math.floor(200 / this.props.gantt.getColumnWidth()) + 10 /* margin */, 'd');
    this.props.action.gantt.updateStartDay(startDay);
  }

  componentDidMount() {
    setTimeout(() => {
      const scrollBody = this.refs.scrollBody as Scrollbars;
      if (scrollBody) {
        scrollBody.scrollLeft(this.props.gantt.getLeft());
      }
    });
		if (this.props.connectDragPreview) {
        this.props.connectDragPreview(getEmptyImage())
    }

    // complete order if need
    const order: Array<string> = this.props.project.getProject().get('ganttOrder');
    if (!order || order.length < 0 || order.length > this.props.project.getAllTasks().size) {
      const p: Project = this.props.project.getProject().toJS();
      p.ganttOrder = this.props.project.getAllTasks().map(t => t ? t.id : '').toArray();
      ProjectService.put(p);
    } else if (order.length < this.props.project.getAllTasks().size) {
      const p: Project = this.props.project.getProject().toJS();
      const allIds = this.props.project.getAllTasks().map(t => t ? t.id : '').toArray();
      allIds.forEach(id => {
        if (order.indexOf(id) < 0) order.push(id);
      })
      p.ganttOrder = order;
      ProjectService.put(p)
    }
  }

  render() {
    if (!this.props.classes) return null;
    const style = { width: '100%', height: '100%', backgroundColor: P_IVORY };
    let headerWidth = 30; // padding
    const headers = this.props.gantt.getHeaders();
    headers.forEach(h => {
      headerWidth = headerWidth + getWidthByHeader(h);
    });
    
    const order: Array<string> = this.props.project.getProject().get('ganttOrder');
    const tasks = this.props.project.getTasks().sort((a, b) => {
      return a && b && order ? order.indexOf(a.id) - order.indexOf(b.id) : 0;
    }).toArray();

    return <div style={style}>
        <Popover
          open={!!this.props.gantt.getSettingAnchor()}
          onClose={this.handleCloseSetting.bind(this)}
          anchorEl={this.props.gantt.getSettingAnchor()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div>
            <FormControlLabel label={'タスク名'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.NAME) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.NAME)}).bind(this)}
              value={GanttHeader.NAME.toString()} color='primary' disabled></Switch>} /><br />
            <FormControlLabel label={'開始予定'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.EXPECTED_START_DATE) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.EXPECTED_START_DATE)}).bind(this)}
              value={GanttHeader.EXPECTED_START_DATE.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'完了予定'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.EXPECTED_END_DATE) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.EXPECTED_END_DATE)}).bind(this)}
              value={GanttHeader.EXPECTED_END_DATE.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'開始日'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.ACTUAL_START_DATE) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.ACTUAL_START_DATE)}).bind(this)}
              value={GanttHeader.ACTUAL_START_DATE.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'完了日'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.ACTUAL_END_DATE) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.ACTUAL_END_DATE)}).bind(this)}
              value={GanttHeader.ACTUAL_END_DATE.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'ステータス'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.STATUS) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.STATUS)}).bind(this)}
              value={GanttHeader.STATUS.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'進捗'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.PROGRESS) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.PROGRESS)}).bind(this)}
              value={GanttHeader.PROGRESS.toString()} color='primary'></Switch>} /><br />
            <FormControlLabel label={'担当'} control={<Switch checked={this.props.gantt.getHeaders().indexOf(GanttHeader.ASSIGNEE) >= 0}
              onChange={(() => {this.handleChangeSetting(GanttHeader.ASSIGNEE)}).bind(this)}
              value={GanttHeader.ASSIGNEE.toString()} color='primary'></Switch>} /><br />
          </div>
        </Popover>
      {this.renderRowHeaderTitle(headerWidth)}
      {this.renderRowHeader(headerWidth, tasks)}
      {this.renderBody(headerWidth, tasks)}
    </div>
  }

  handleChangeSetting(header: GanttHeader) {
    const headers = this.props.gantt.getHeaders();
    const index = headers.indexOf(header);
    if (index >= 0) {
      this.props.action.gantt.updateHeaders(headers.splice(index, 1).toArray());
    } else {
      this.props.action.gantt.updateHeaders(headers.push(header).toArray().sort((a, b) => a - b));
    }
  }

  handleCloseSetting() {
    this.props.action.gantt.hideSettingPopOver();
  }

  renderRowHeaderTitle(width: number) {
    if (!this.props.classes) return null;
    return <div style={{ width: width + 'px', height: ProjectGantt.CalenderHeight, top: '80px', backgroundColor: P_IVORY,
      boxShadow: '2px 2px 4px 0px #ccc', paddingLeft: '20px', position: 'absolute', overflow: 'hidden', zIndex: 998 }}>
        <IconButton aria-label="Clear" className={this.props.classes.settings} onClick={this.handleOpenSetting.bind(this)}>
          <SettingsIcon className={this.props.classes.settingsIcon} />
        </IconButton>
        {this.renderHeaderTitleInner()}
    </div>
  }

  handleOpenSetting(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.action.gantt.showSettingPopOver(event.currentTarget);
  }

  renderHeaderTitleInner() {
    const headers = this.props.gantt.getHeaders();
    const cols: JSX.Element[] = [];
    
    headers.map(header => {
      const style: CSSProperties = {
        width: getWidthByHeader(header),
        fontSize: '10px',
        height: '100%',
        lineHeight: '20px',
        float: 'left',
        top: '20px',
        position: 'relative'
      }
      switch (header) {
        case GanttHeader.NAME:
          cols.push(<div key={'h-title' + header} style={style}>{'タスク名'}</div>);
          break;
        case GanttHeader.ACTUAL_START_DATE:
          cols.push(<div key={'h-title' + header} style={style}>{'開始日'}</div>);
          break;
        case GanttHeader.ACTUAL_END_DATE:
          cols.push(<div key={'h-title' + header} style={style}>{'完了日'}</div>);
          break;
        case GanttHeader.EXPECTED_START_DATE:
          cols.push(<div key={'h-title' + header} style={style}>{'開始予定'}</div>);
          break;
        case GanttHeader.EXPECTED_END_DATE:
          cols.push(<div key={'h-title' + header} style={style}>{'完了予定'}</div>);
          break;
        case GanttHeader.STATUS:
          cols.push(<div key={'h-title' + header} style={style}>{'ステータス'}</div>)
          break;
        case GanttHeader.PROGRESS:
          cols.push(<div key={'h-title' + header} style={style}>{'進捗'}</div>)
          break;
        case GanttHeader.ASSIGNEE:
          cols.push(<div key={'h-title' + header} style={style}>{'担当'}</div>)
          break;
        default: 
            break;
      }
    });
    return cols;
  }

  renderRowHeader(width: number, tasks: Task[]) {
    return <div style={{ width: width + 'px', height: '100%', top: ProjectGantt.CalenderHeight, backgroundColor: P_IVORY, boxShadow: '2px 2px 4px 0px #ccc',
      borderTop: 'solid 1px lightgray', float: 'left', position: 'relative', overflow: 'hidden', zIndex: 999 }}>
      {this.renderTaskHeader(width, tasks)}
    </div>
  }

  renderTaskHeader(width: number, tasks: Task[]) {
    const scrollTop = this.props.gantt.getTop();
    return tasks.map((t, i) => {
      if (t && i !== undefined) {
        return <GanttRowHeader key={'g-r-h-' + i} width={width} top={i * 20 - scrollTop} task={t} index={i}
          handleNameClick={this.handleNameClick.bind(this)} moveRow={this.moveRow.bind(this)} commitRow={this.commitRow.bind(this)}></GanttRowHeader> 
      }
    });
  }

  handleNameClick(taskId: string) {
    TaskService.get(taskId).then(res => {
      this.props.action.taskForm.updateTask(res.data);
      this.props.action.project.showTaskModal();
    });
  }

  moveRow(taskId: string, from: number, to: number) {
    const project = this.props.project.getProject();
    const ganttOrder: Array<String> = this.props.project.getProject().get('ganttOrder');
    const index = ganttOrder.indexOf(taskId);
    if (index < 0) return;
    ganttOrder.splice(index, 1);
    if (from <= to) {
      ganttOrder.splice(to, 0, taskId);
    } else if (from > to) {
      ganttOrder.splice(to, 0, taskId);
    }
    this.props.action.project.localUpdateProject(project.set('ganttOrder', ganttOrder).toJS())
  }

  commitRow() {
    this.props.action.project.updateProject(this.props.project.getProject().toJS());
  }

  renderAvatar(u: User) {
      return <Avatar key={'task-' + u.id} style={{ width: 18, height: 18, top: '1px', float: 'left', fontSize: '14px'}}>
        {u && u.name ? u.name.substr(0, 1) : '?'}</Avatar>
  }

  renderBody(headerWidth: number, tasks: Task[]) {
    const rows = this.renderCalender();
    const colWidth = this.props.gantt.getColumnWidth();
    const h = tasks.length * 20;
    if (!this.props.connectDropTarget) return;
    return this.props.connectDropTarget(<div style={{ width: 'calc(100% - ' + headerWidth + 'px)', height: '100%', backgroundColor: 'lightgray', float: 'left' }}>
      <div id='gantt-calender' style={{ position: 'sticky', top: '0px', 
          width: this.props.gantt.getWidth() + 'px', 
          height: ProjectGantt.CalenderHeight, 
          maxHeight: ProjectGantt.CalenderHeight,
          backgroundColor: 'white',
          overflow: 'hidden' }}>
        {rows && rows.monthCols}
        <div style={{clear: 'both'}}></div>
        { rows && colWidth >= ProjectGantt.weekOrDayThreshold && rows.dateCols }
        { rows && colWidth < ProjectGantt.weekOrDayThreshold && rows.weekCols }
      </div>
      <CustomScrollbars id='gantt-body' className='gantt-body' ref="scrollBody" onScroll={this.handleScrollBody.bind(this)}
        style={{ height: 'calc(100% - ' + ProjectGantt.CalenderHeight + ')'}}>
        <div style={{ width: this.props.gantt.getWidth() + 'px', height: h + 'px', minHeight: '100%', position: 'absolute' }}>
          {this.renderBodys(h)}
        </div>
        <div style={{ width: this.props.gantt.getWidth() + 'px', height: h + 'px', minHeight: '100%', position: 'absolute' }}>
          {this.renderGanttChart(tasks)}
        </div>
        { this.props.connectDragSource && this.props.connectDropTarget && this.props.connectDragSource(
          <div style={{ width: this.props.gantt.getWidth() + 'px', height: h + 'px', minHeight: '100%', position: 'absolute' }}>
        </div>) }
      </CustomScrollbars>
    </div>)
  }

  renderBodys(height: number) {
    const colWidth = this.props.gantt.getColumnWidth();
    const totalWidth = this.props.gantt.getWidth();
    const num = totalWidth / ( colWidth );
    const cols = [];
    const st: CSSProperties = { width: colWidth + 'px', height: height + 'px', minHeight: '100%', top: '0px', float: 'left',
      backgroundColor: 'white', borderLeft: 'solid 1px lightgray', position: 'absolute'};
    for (let i = 0; i < num - 1; i++) {
      const sty = Object.assign({ left: i * colWidth + 'px' }, st);
      cols.push(<div key={'gantt-bodys-' + i} style={sty}></div>);
    }
    return cols;
  }

  renderGanttChart(tasks: Task[]) {
    const startDay = this.props.gantt.getStartDay();
    const w = this.props.gantt.getColumnWidth();
    const start = moment(startDay);

    return tasks.map((t, i) => {
      if (t && t.expectedStartDay && t.expectedEndDay && i !== undefined) {
        const sd = moment(t.expectedStartDay);
        const ed = moment(t.expectedEndDay);
        const range = ed.diff(sd, 'd');
        if (range < 0) return;

        return <GanttBar key={'gantt-bar-' + i} left={(sd.diff(start, 'd')) * (w) + 'px'} width={(w) * (range + 1)}
          top={20 * (i) + 1} height={'18px'} task={t} snap={w}></GanttBar>;
      }
    });
  }

  renderCalender() {
    if (!this.props.gantt.getStartDay()) return null;
    const colWidth = this.props.gantt.getColumnWidth();
    const totalWidth = this.props.gantt.getWidth();
    const num = totalWidth / ( colWidth );
    const monthCols = [];
    const dateCols = [];
    const weekCols = [];
    const _startDay = this.props.gantt.getStartDay();
    const startDay = _startDay ? _startDay.clone() : _startDay;
    const needWeekCols = colWidth < ProjectGantt.weekOrDayThreshold;
    
    let beforeMonth = startDay.month() + 1;
    let monthWidthTotal = 0;
    let dayCnt = 1;
    let monthChanged = false;

    let weekWidthTotal = 0;
    let weekCaptionCnt = 1;
    let weekWidthCnt = 1;

    const today = moment().format('YYYYMMDD');

    let isToday = false;
    let checked = false;
    let todayLeft = 0;
    for (let i = 0; i < num - 1; i++) {
      if (!checked && startDay.format('YYYYMMDD') == today) {
        isToday = true;
        checked = true;
      } else {
        isToday = false;
      }

      const dayLeft = i * colWidth - this.props.gantt.getLeft();

      dateCols.push(<div key={'cal-day-' + i} style={dayStyle(colWidth + 'px', dayLeft + 'px', isToday, startDay.weekday())}>{startDay.date()}</div>);
      if (isToday) {
        todayLeft = dayLeft;
      }
      startDay.add(1, 'd');

      if (beforeMonth != startDay.month() + 1) {
        monthCols.push(<div key={'cal-mon-' + i} 
          style={monStyle(dayCnt * colWidth + 'px', 
            monthWidthTotal - this.props.gantt.getLeft() + 'px')}>{startDay.year() + '/' + beforeMonth}</div>);
        monthWidthTotal = monthWidthTotal +  dayCnt * (colWidth);

        if (needWeekCols && startDay.day() != 1) {
          const weekWidth = weekWidthCnt * (colWidth);
          const weekLeft = weekWidthTotal - this.props.gantt.getLeft();
          const weekRight = weekLeft + weekWidth;

          weekCols.push(<div key={'cal-week-' + i} 
            style={weekStyle(weekWidth + 'px', weekWidthTotal - this.props.gantt.getLeft() + 'px', (!!todayLeft && weekLeft <= todayLeft && weekRight >= todayLeft))}>
              {weekCaptionCnt + 'w'}</div>);
          weekWidthTotal = weekWidthTotal + weekWidth;
        }

        beforeMonth = startDay.month() + 1;
        dayCnt = 1;
        weekCaptionCnt = 1;
        weekWidthCnt = 1;
        monthChanged = true;
      } else {
        dayCnt++;
        monthChanged = false;
        weekWidthCnt++;
      }

      if (needWeekCols && startDay.day() == 0 && !monthChanged) {
        const weekWidth = weekWidthCnt * (colWidth);
        const weekLeft = weekWidthTotal - this.props.gantt.getLeft();
        const weekRight = weekLeft + weekWidth;
        weekCols.push(<div key={'cal-week-' + i}
          style={weekStyle(weekWidth + 'px', weekLeft + 'px', (!!todayLeft && weekLeft <= todayLeft && weekRight >= todayLeft))}>
          {weekCaptionCnt + 'w'}</div>);
        weekWidthTotal = weekWidthTotal + weekWidth;
        weekCaptionCnt++;
        weekWidthCnt = 0;
      }
    }

    if (!monthChanged) {
      // 月末で描画が終わった場合
      monthCols.push(<div key={'cal-mon-last'} style={
        monStyle((dayCnt - 2) * (colWidth ) + 'px', 
        monthWidthTotal - this.props.gantt.getLeft() + 'px')}>{startDay.year() + '/' + beforeMonth}</div>);
    }
    return { monthCols, weekCols, dateCols };
  }

  handleScrollHeader(event: Event) {
    const scrollHeader = this.refs.scrollHeader as Scrollbars;
    const scrollBody = this.refs.scrollBody as Scrollbars;
    if (scrollBody && scrollHeader) {
      scrollBody.scrollTop(scrollHeader.getScrollTop());
    }
  }

  handleScrollBody(event: Event) {
    const scrollBody = this.refs.scrollBody as Scrollbars;
    const el = window.document.getElementById('gantt-body');
    if (event.srcElement && event.srcElement.scrollLeft >= 0) {
      const colWidth = this.props.gantt.getColumnWidth();
      const startDay = this.props.gantt.getStartDay();
      if (event.srcElement.scrollLeft < 100) {
        const additional = this.props.isDragging ? 30 : 100; // 適当
        const additionalDays = additional / colWidth;
        this.props.action.gantt.updateWidthAndStartDay(this.props.gantt.getWidth() + additional, startDay.clone().subtract(additionalDays, 'd'));
        if (scrollBody) {
          scrollBody.scrollLeft(scrollBody.getScrollLeft() + additional);
        }
      } else {
        const additional = 60; // 適当
        const additionalDays = additional / colWidth;
        if (el && el.children[0] && el.children[0].clientWidth) {
          if (this.props.gantt.getWidth() - el.children[0].clientWidth - event.srcElement.scrollLeft < 100) {
            this.props.action.gantt.updateWidthAndStartDay(this.props.gantt.getWidth() + additional, startDay.clone().add(additionalDays, 'd'));
          }
        }
      }
      this.props.action.gantt.updateCoord(event.srcElement.scrollLeft, event.srcElement.scrollTop);
    }
  }
  
}

interface StateProps {
  gantt: GanttState;
  project: ProjectState;
}

interface DispatchProps {
  action: {
    gantt: GanttDispatcher,
    project: ProjectDispatcher,
    taskForm: TaskFormDispatcher,
  };
}

function mapStateToProps(state: AppState) {
  return {
    gantt: state.gantt,
    project: state.project,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      gantt: new GanttDispatcher(dispatch),
      project: new ProjectDispatcher(dispatch),
      taskForm: new TaskFormDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: MergedProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  settings: {
    position: 'absolute',
    padding: '3px',
    right: '0px'
  },
  settingsIcon: {
    fontSize: '16px'
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
  hover(props: MergedProps, monitor: DropTargetMonitor, component: any) {
    if (monitor.getItemType() === ItemTypes.GANTT_BODY) {
      try {
        const offset = monitor.getDifferenceFromInitialOffset();
        if (!offset) return;
        const dom: any = ReactDOM.findDOMNode(component);
        const node = dom.getElementsByClassName("gantt-body").item(0).children[0];
        const l = ProjectGantt.startLeft + offset.x;
        const t = ProjectGantt.startTop + offset.y;
        node.scrollLeft = l;
        node.scrollTop = t > 0 ? t : 0;
        return;
      } catch (e) {
        // パフォーマンスのため、チェック等は極力省いて握りつぶす
        return;
      }
    }
  },

  drop(props: MergedProps, monitor: any) {
    const itemType = monitor.getItemType();
    if (itemType === ItemTypes.GANTT_BAR) {      
      const x = monitor.getDifferenceFromInitialOffset().x;
      const snap = props.gantt.getColumnWidth();
      const diff = Math.round(x / snap);
      const task: Task = monitor.getItem().task;
      if (diff === 0) return;
      if (task.expectedStartDay) task.expectedStartDay = moment(task.expectedStartDay).add(diff, 'd').toDate();
      if (task.expectedEndDay) task.expectedEndDay = moment(task.expectedEndDay).add(diff, 'd').toDate();
      props.action.project.updateTask(task);
    } else if (monitor.getItemType() === ItemTypes.GANTT_RESIZER) {
      const offset = monitor.getDifferenceFromInitialOffset();
      if (!offset) return;
      const w = props.gantt.getColumnWidth();
      const diff = Math.round(offset.x / w);
      const task: Task = monitor.getItem().task;
      if (diff != 0 && task.expectedEndDay) {
        const start = moment(task.expectedStartDay);
        const afterEnd = moment(task.expectedEndDay).add(diff, 'd');
        if (afterEnd.diff(start, 'd') < 0) return;

        task.expectedEndDay = afterEnd.toDate();
        props.action.project.updateTask(task);
      }      
    }
    return;
  }
};

const statusSource: DragSourceSpec<ProjectGanttProps, any> = {
  beginDrag(props, monitor: DragSourceMonitor, component) {
    ProjectGantt.startLeft = component.props.gantt.getLeft();
    ProjectGantt.startTop = component.props.gantt.getTop();
    return props;
  },

  endDrag(props, monitor: DragSourceMonitor, component) {
    return;
  },

  isDragging(props, monitor: DragSourceMonitor) {
    return true;
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

const styled = withStyles(styles)(ProjectGantt)
const draggable = DropTarget<ProjectGanttProps>([ItemTypes.GANTT_BODY, ItemTypes.GANTT_BAR, ItemTypes.GANTT_RESIZER], dropTarget, dropCollect)(DragSource<ProjectGanttProps>(ItemTypes.GANTT_BODY, statusSource, dragCollect)(styled));
export default connect<StateProps, DispatchProps, ProjectGanttProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
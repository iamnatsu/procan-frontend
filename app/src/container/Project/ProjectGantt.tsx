import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/index';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { withStyles, StyledComponentProps } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { P_IVORY } from '../../config/Color';
import { default as CustomScrollbars } from 'react-custom-scrollbars';
import { GanttState } from '../../redux/Gantt/GanttReducer';
import { GanttDispatcher } from '../../redux/Gantt/GanttDispatcher';
import * as moment from 'moment';

export interface ProjectGanttProps { }
export interface ProjectGanttState { }

type MergedProps = StateProps & DispatchProps & ProjectGanttProps & StyledComponentProps;

class ProjectGantt extends React.Component<MergedProps, ProjectGanttState> {
  componentWillMount() {
    this.props.action.gantt.updateLeft(200);
    this.props.action.gantt.updateWidth(window.parent.screen.width + 400);
   const startDay = moment().subtract(Math.floor(200 / this.props.gantt.getColumnWidth()), 'd');
   this.props.action.gantt.updateStartDay(startDay);
  }

  componentDidMount() {
    setTimeout(() => {
      const el = window.document.getElementById("hoge")
      if (el) {
        console.dir(el.children[0].scrollLeft)
        el.children[0].scrollLeft = 200;
      }
    });
  }

  render() {
    if (!this.props.classes) return null;
    const style = { width: '100%', height: '100%', backgroundColor: P_IVORY };
    return <div style={style}>
      {this.renderHeader()}
      {this.renderBody()}
    </div>
  }

  renderHeader() {
    return <div style={{ width: '200px', height: '100%', backgroundColor: 'yellow', float: 'left' }}>
      <div style={{ width: '200px', height: '20px', color: 'blue' }}>aaa</div>
      <div style={{ width: '200px', height: '20px', color: 'blue' }}>aaa2</div>
      <div style={{ width: '200px', height: '20px', color: 'blue' }}>aaa3</div>
    </div>
  }

  renderBody() {
    return <div style={{ width: 'calc(100% - 200px)', height: '100%', backgroundColor: 'lightgray', float: 'left' }}>
      <CustomScrollbars id="hoge" onScroll={this.handleScroll.bind(this)}>
        <div style={{ width: this.props.gantt.getWidth() + 'px', height: '40px', backgroundColor: 'white' }}>
          {this.renderCalender()}
        </div>
        <div style={{ width: this.props.gantt.getWidth() + 'px', height: 'calc(100% - 40px)' }}>aaa</div>
      </CustomScrollbars>
    </div>
  }

  renderCalender() {
    const colWidth = this.props.gantt.getColumnWidth();
    const totalWidth = this.props.gantt.getWidth();
    const num = totalWidth / ( colWidth - 1);
    const rows = [];
    const _startDay = this.props.gantt.getStartDay();
    const startDay = _startDay ? _startDay.clone() : _startDay;
    const s: CSSProperties = { fontSize: '10px', width: colWidth + 'px', height: '100%', float: 'left', border: 'solid 1px #000', marginLeft: '-1px' };
    for (let i = 0; i < num; i++) {
      rows.push(
        <div key={'cal-day-' + i} style={s}>
          {String(startDay.year()).substr(2, 2)}<br></br>
          {startDay.month() + 1}<br></br>
          {startDay.date()}
        </div>
      )
      startDay.add(1, 'd');
    }
    return rows;
  }

  handleScroll(event: Event) {
    if (event.srcElement && event.srcElement.scrollLeft >= 0) {
      const el = window.document.getElementById("hoge");
      const colWidth = this.props.gantt.getColumnWidth();
      const additional = 40;
      const additionalDay = additional / colWidth;
      const startDay = this.props.gantt.getStartDay();

      if (event.srcElement.scrollLeft < 100) {
        this.props.action.gantt.updateWidthAndStartDay(this.props.gantt.getWidth() + additional, startDay.clone().subtract(additionalDay, 'd'));
        if (el) {
          el.children[0].scrollLeft = el.children[0].scrollLeft + 40;
        }
      } else {
        if (el && el.children[0] && el.children[0].clientWidth) {
          if (this.props.gantt.getWidth() - el.children[0].clientWidth - event.srcElement.scrollLeft < 100) {
            this.props.action.gantt.updateWidthAndStartDay(this.props.gantt.getWidth() + additional, startDay.clone().add(additionalDay, 'd'));
          }
        }
      }
    }
    /*
    const el = window.document.getElementById("hoge")
    if (el) {
      console.dir(el.children[0].clientWidth)
    }
    */
  }
}


interface StateProps {
  gantt: GanttState;
}

interface DispatchProps {
  action: {
    gantt: GanttDispatcher,
  };
}

function mapStateToProps(state: AppState) {
  return {
    gantt: state.gantt,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    action: {
      gantt: new GanttDispatcher(dispatch),
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProjectGanttProps): MergedProps {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const styles: Record<string, CSSProperties> = {
  paper: {
    minWidth: 250,
    maxWidth: 250,
    minHeight: 100,
  },
}
const styled = withStyles(styles)(ProjectGantt)
const draggable = DragDropContext(HTML5Backend)(styled);
export default connect<StateProps, DispatchProps, ProjectGanttProps, MergedProps>(mapStateToProps, mapDispatchToProps, mergeProps)(draggable);
import { Record, List /*Map*/ } from 'immutable';
import * as moment from 'moment';
import { GanttHeader } from '../../model/common';

const DefaultHeaders = List([
  GanttHeader.NAME,
  GanttHeader.EXPECTED_END_DATE,
  GanttHeader.ASSIGNEE]);

function ganttHeaders()  {
  if (window.localStorage && window.localStorage.getItem('gantt-headers')) {
    const strHeaders = window.localStorage.getItem('gantt-headers');
    return strHeaders ? List(strHeaders.split(',').map(h => h ? Number(h) : null)) : DefaultHeaders;
  } else {
    return DefaultHeaders;
  }
}

const GanttRecord = Record({ 
  left: 0,
  top: 0,
  width: 0,
  columnWidth: 18,
  startDay: null,
  headers: ganttHeaders(),
  settingAnchor: null,
});

export default class GanttStore extends GanttRecord {
  getLeft(): number {
    return this.get('left');
  }

  setLeft(left: number): this {
    return this.set('left', left) as this;
  }

  getTop(): number {
    return this.get('top');
  }

  setTop(top: number): this {
    return this.set('top', top) as this;
  }

  setCoord(left: number, top: number): this {
    return this.set('top', top).set('left', left) as this;
  }

  getWidth(): number {
    return this.get('width');
  }

  setWidth(width: number): this {
    return this.set('width', width) as this;
  }

  getColumnWidth(): number {
    return this.get('columnWidth')
  }

  setColumnWidth(width: number): this {
    return this.set('columnWidth', width) as this;
  }

  getStartDay(): moment.Moment {
    return this.get('startDay');
  }

  setStartDay(date: moment.Moment): this {
    return this.set('startDay', date) as this;
  }

  setWidthAndStartDay(width: number, date: moment.Moment) {
    return this.set('width', width).set('startDay', date) as this;
  }

  getHeaders(): List<GanttHeader> {
    return this.get('headers');
  }

  setHeaders(headers: GanttHeader[]) {
    if (window.localStorage) {
      window.localStorage.setItem('gantt-headers', headers.join(','))
    }
    return this.set('headers', List(headers)) as this;
  }

  getSettingAnchor(): HTMLElement | null {
    return this.get('settingAnchor');
  }

  setSettingAnchor(anchor: HTMLElement) {
    return this.set('settingAnchor', anchor) as this;
  }
}

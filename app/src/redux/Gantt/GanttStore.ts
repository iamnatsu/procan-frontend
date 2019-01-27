import { Record, /*Map*/ } from 'immutable';
import * as moment from 'moment';

const GanttRecord = Record({ 
  left: 0,
  width: 0,
  columnWidth: 20,
  startDay: null,
});

export default class GanttStore extends GanttRecord {
  getLeft(): number {
    return this.get('left');
  }

  setLeft(left: number): this {
    return this.set('left', left) as this;
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
    return this.get('startDay')
  }

  setStartDay(date: moment.Moment): this {
    return this.set('startDay', date) as this;
  }

  setWidthAndStartDay(width: number, date: moment.Moment) {
    return this.set('width', width).set('startDay', date) as this;
  }
}

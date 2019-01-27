import { GanttUpdateScrollLeft, GanttUpdateWidth, GanttUpdateStartDay, GanttUpdateWidthAndStartDay } from './GanttActionCreator';
import * as moment from 'moment';
export class GanttDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  updateLeft(left: number) {
    this.dispatch(GanttUpdateScrollLeft(left));
  }

  updateWidth(width: number) {
    this.dispatch(GanttUpdateWidth(width));
  }

  updateStartDay(date: moment.Moment) {
    this.dispatch(GanttUpdateStartDay(date));
  }

  updateWidthAndStartDay(width: number, date: moment.Moment) {
    this.dispatch(GanttUpdateWidthAndStartDay(width, date));
  }

}

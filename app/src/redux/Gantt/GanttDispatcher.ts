import { GanttUpdateScrollLeft, GanttUpdateWidth, GanttUpdateStartDay, GanttUpdateWidthAndStartDay, GanttUpdateScrollTop, GanttUpdateScrollCoord, GanttUpdateHeaders, GanttUpdateSettingAnchor } from './GanttActionCreator';
import * as moment from 'moment';
import { GanttHeader } from '../../model/common';
export class GanttDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  updateLeft(left: number) {
    this.dispatch(GanttUpdateScrollLeft(left));
  }

  updateTop(top: number) {
    this.dispatch(GanttUpdateScrollTop(top));
  }

  updateCoord(left: number, top: number) {
    this.dispatch(GanttUpdateScrollCoord(left, top));
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

  updateHeaders(headers: GanttHeader[]) {
    this.dispatch(GanttUpdateHeaders(headers));
  }

  showSettingPopOver(anchor: HTMLElement) {
    this.dispatch(GanttUpdateSettingAnchor(anchor))
  }

  hideSettingPopOver() {
    this.dispatch(GanttUpdateSettingAnchor(null))
  }

}

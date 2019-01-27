import { ActionType } from '../ActionType';
import * as moment from 'moment';
export const GanttUpdateScrollLeft = (left: number) => ({ type: ActionType.GanttUpdateScrollLeft, left });
export const GanttUpdateWidth = (width: number) => ({ type: ActionType.GanttUpdateWidth, width });
export const GanttUpdateStartDay = (date: moment.Moment) => ({ type: ActionType.GanttUpdateStartDay, date });
export const GanttUpdateWidthAndStartDay = (width: number, date: moment.Moment) => ({ type: ActionType.GanttUpdateWidthAndStartDay, width, date });
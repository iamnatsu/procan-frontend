import { CSSProperties } from "react";
import { P_LIGHT_LIGHT_BLUE, P_RED_LIGHT, P_IVORY } from "../../config/Color";
import { GanttHeader } from "../../model/common";

export function dayStyle(w: string, l: string, isToday: boolean, weekDay: number): CSSProperties {
  return {
    fontSize: '10px',
    width: w,
    height: '20px',
    float: 'left',
    textAlign: 'center',
    lineHeight: '20px',
    top: '20px',

    borderLeft: 'solid 1px lightgray',
    borderBottom: 'solid 1px lightgray',
    position: 'absolute',
    left: l,
    backgroundColor: isToday ? P_LIGHT_LIGHT_BLUE : weekDay == 0 ? P_RED_LIGHT : 'transparent'
  };
}

export function monStyle(w: string, l: string): CSSProperties {
  return {
    width: w,
    height: '20px',
    float: 'left',
    textAlign: 'center',
    lineHeight: '20px',

    fontSize: '14px',
    borderLeft: 'solid 1px lightgray',
    borderBottom: 'solid 1px lightgray',
    position: 'absolute',
    left: l,
    backgroundColor: P_IVORY
  }
}

export function weekStyle(w: string, l: string , isToday = false): CSSProperties {
  return {
    fontSize: '10px',
    width: w,
    height: '20px',
    float: 'left',
    textAlign: 'center',
    lineHeight: '20px',

    top: '20px',
    borderLeft: 'solid 1px lightgray',
    borderBottom: 'solid 1px lightgray',
    position: 'absolute',
    left: l,
    backgroundColor: isToday ? P_LIGHT_LIGHT_BLUE : 'transparent'
  }
}

export function getWidthByHeader(header?: GanttHeader) {
  switch (header) {
    case GanttHeader.NAME: 
      return 200;
    case GanttHeader.ACTUAL_START_DATE: 
    case GanttHeader.ACTUAL_END_DATE: 
    case GanttHeader.EXPECTED_START_DATE: 
    case GanttHeader.EXPECTED_END_DATE: 
      return 50;
    case GanttHeader.STATUS: 
      return 100;
    case GanttHeader.PROGRESS: 
      return 30;
    case GanttHeader.ASSIGNEE: 
      return 20;
    default: 
      return 0;
  }
}

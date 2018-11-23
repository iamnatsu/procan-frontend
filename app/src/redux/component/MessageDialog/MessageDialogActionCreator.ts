import { ActionType } from '../../ActionType';
import { MessageDialogActionMap } from './MessageDialogStore';

export const MessageDialogUpdateAction = (isShow: boolean, title: string, message: Array<any>, action = {}, actionMap?: MessageDialogActionMap) =>
                                               ({ type: ActionType.MessageDialogUpdateAction, isShow, title, message, action, actionMap });
export const MessageDialogUpdateIsShowAction = (isShow: boolean) => ({ type: ActionType.MessageDialogUpdateIsShowAction, isShow });

/*
export const confirmActions = {
  update: createAction(ActionType.ComponentConfirmModalUpdateAction, (isShow: boolean, title: string, message: Array<any>, action: () => {}) => ({ type: ActionType.ComponentConfirmModalUpdateAction, isShow, title, message, action })),
  updateOpened: createAction(ActionType.ComponentConfirmModalUpdateIsShowAction, (isShow: boolean) => ({ type: ActionType.ComponentConfirmModalUpdateIsShowAction, isShow })),
};
*/

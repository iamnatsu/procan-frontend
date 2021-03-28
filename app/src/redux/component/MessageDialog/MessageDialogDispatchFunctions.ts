import { MessageDialogUpdateAction, MessageDialogUpdateIsShowAction } from './MessageDialogActionCreator';
import { MessageDialogActionMap } from './MessageDialogStore';

export class MessageDialogDispatchFunctions {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  showMessage(title: string, message: Array<any>, action = () => {}, actionMap?: MessageDialogActionMap) {
    this.dispatch(MessageDialogUpdateAction(true, title, message, action, actionMap));
  }

  closeMessage() {
    this.dispatch(MessageDialogUpdateIsShowAction(false));
  }

  /*

  showConfirm(title: string, message: Array<any>, action: () => any) {
    this.dispatch(confirmActions.update(true, title, message, action));
  }

  closeConfirm() {
    this.dispatch(confirmActions.updateOpened(false));
  }
  */
}

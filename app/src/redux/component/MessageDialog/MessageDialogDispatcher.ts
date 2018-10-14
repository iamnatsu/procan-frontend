import { MessageDialogUpdateAction, MessageDialogUpdateIsShowAction } from './MessageDialogActionCreator';

export class MessageDialogDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  showMessage(title: string, message: Array<any>, action = () => {}) {
    this.dispatch(MessageDialogUpdateAction(true, title, message, action));
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

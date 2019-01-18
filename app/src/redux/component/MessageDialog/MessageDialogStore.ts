import { Record, List, Map, fromJS } from 'immutable';

const MessageDialogRecord = Record({ isShow: false, isConfirmShow: false, title: '', messageList: List(), modalAction: null, confirmAction: null, actionMap: Map() });
export type MessageDialogActionMap = { [k:string]: { action: () => void, caption: string, color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined } };

export default class MessageDialogStore extends MessageDialogRecord {

  isShow() {
    return this.get('isShow');
  }

  setIsShow(isShow: boolean): this {
    return this.set('isShow', isShow) as this;
  }

  getActionMap() {
    return this.get('actionMap');
  }

  setConfirmIsShow(isShow: boolean): this {
    return this.set('isConfirmShow', isShow) as this;
  }

  getTitle() {
    return this.get('title');
  }

  setTitle(title: string) {
    return this.set('title', title);
  }

  getMessageList() {
    return (this.get('messageList') && this.get('messageList').size > 0) ? this.get('messageList').toJS() : [];
  }

  setMessageList(message: Array<string>) {
    return this.set('messageList', List(message));
  }

  setModal(isShow: boolean, title: string, messageList: Array<string>, action: () => void, actionMap?: { [k:string]: { action: () => void, caption: string } }): this {
    return this.update('isShow', (old: boolean) => old = isShow)
      .update('title', (old: string) => old = title)
      .update('messageList', (old: List<any>) => old = fromJS(messageList))
      .update('modalAction', (old: () => void) => old = action)
      .update('actionMap', (old: Map<string, any>) => old = fromJS(actionMap ? actionMap: {})) as this;
  }

  getModalAction() {
    return this.get('modalAction');
  }

  setConfirmModal(isShow: boolean, title: string, messageList: Array<string>, action: () => {}): this {
    return this.update('isConfirmShow', (old: boolean) => old = isShow)
      .update('title', (old: string) => old = title)
      .update('messageList', (old: List<any>) => old = fromJS(messageList))
      .update('confirmAction', (old: () => void) => old = action) as this;
  }

  getConfirmAction() {
    return this.get('confirmAction');
  }

  setConfirmAction(f: () => void) {
    return this.set('confirmAction', f);
  }
}

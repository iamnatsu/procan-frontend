import { UserCardUpdateIsShowAction } from './UserCardActionCreator';
import { User } from '../../../model/user';

export class UserCardDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  show(anchorEl: HTMLElement, user: User, onDelete: () => void) {
    this.dispatch(UserCardUpdateIsShowAction(true, anchorEl, user, onDelete));
  }
  close() {
    this.dispatch(UserCardUpdateIsShowAction(false, null, null, () => {}));
  }

}

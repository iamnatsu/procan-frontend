import { Record, Map } from 'immutable';
import { User } from '../../../model/user';

const UserCardRecord = Record({ 
  isShow: false, 
  anchorEl: null,
  user: Map(),
  onDelete: () => {}
});

export default class UserCardStore extends UserCardRecord {
  setShow(isShow: true, anchorEl: HTMLElement | null, user: User | null, onDelete: () => void) {
    return this.set('anchorEl', anchorEl).set('isShow', isShow).set('user', user ? Map(user) : Map()).set('onDelete', onDelete) as this;
  }
}
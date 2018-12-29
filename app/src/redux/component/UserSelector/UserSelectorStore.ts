import { Record, List, Map } from 'immutable';
import { User } from '../../../model/user';

const UserSelectorRecord = Record({ isShow: false, anchorEl: null, onSubmit: () => {}, candidates: List(), selections: Map() });

export default class UserSelectorStore extends UserSelectorRecord {
  setShow(isShow: true, anchorEl: HTMLElement | null, onSubmit: () => {}) {
    return this.set('anchorEl', anchorEl).set('isShow', isShow).set('onSubmit', onSubmit) as this;
  }

  getCandidates() {
    return this.get('candidates');
  }

  setCandidates(candidates: User[]) {
    return this.set('candidates', List(candidates)) as this;
  }

  getSelections() {
    return this.get('selections');
  }

  setSelections(selections: { [id: string]: User }) {
    return this.set('selections', Map(selections)) as this;
  }
}
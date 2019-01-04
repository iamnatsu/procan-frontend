import { Record, List, Map } from 'immutable';
import { User } from '../../../model/user';

const UserSelectorRecord = Record({ isShow: false, anchorEl: null, onSubmit: () => {}, candidates: List(), selections: Map() });

export default class UserSelectorStore extends UserSelectorRecord {
  setShow(isShow: boolean, anchorEl: HTMLElement | null, onSubmit: () => {}) {
    if (isShow) {
      return this.set('anchorEl', anchorEl).set('isShow', isShow).set('onSubmit', onSubmit) as this;
    } else {
      return this.set('anchorEl', anchorEl).set('isShow', isShow).set('onSubmit', onSubmit).set('candidates', List()).set('selections', Map()) as this;
    }
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
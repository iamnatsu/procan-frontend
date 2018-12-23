import { UserSelectorUpdateIsShowAction,UserSelectorUpdateCandidates, UserSelectorUpdateSelections } from './UserSelectorActionCreator';
import { User } from '../../../model/user';

export class UserSelectorDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  show(anchorEl: HTMLElement) {
    this.dispatch(UserSelectorUpdateIsShowAction(true, anchorEl));
  }
  close() {
    this.dispatch(UserSelectorUpdateIsShowAction(false, null));
  }

  updateCandidate(candidates: User[]) {
    this.dispatch(UserSelectorUpdateCandidates(candidates));
  }

  updateSelections(selections: { [id: string]: User }) {
    this.dispatch(UserSelectorUpdateSelections(selections));
  }
}

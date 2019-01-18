import { ProfileUpdateUser } from './ProfileActionCreator';
import { User } from '../../model/user';

export class ProfileDispatcher {
  constructor(public dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  updateUser(user: User) {
    this.dispatch(ProfileUpdateUser(user));
  }

}

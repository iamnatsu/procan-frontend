import { Record, Map } from 'immutable';
import { Project } from '../../model/project';
import { User } from '../../model/user';


const ProfileRecord = Record({ 
  user: Map(),
});
export default class ProfileStore extends ProfileRecord {
  getUser(): Map<keyof User, any> {
    return this.get('user');
  }

  setUser(project: Project): this {
    return this.set('user', Map(project)) as this;
  }
}

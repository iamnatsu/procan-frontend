import { ActionType } from '../ActionType';
import { User } from '../../model/user';

export const ProfileUpdateUser = (user: User) => ({ type: ActionType.ProfileUpdateUser, user });
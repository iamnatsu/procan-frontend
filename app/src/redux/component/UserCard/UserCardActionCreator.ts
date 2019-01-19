import { ActionType } from '../../ActionType';
import { User } from '../../../model/user';

export const UserCardUpdateIsShowAction = (isShow: boolean, anchorEl: HTMLElement | null, user: User | null, onDelete?: () => void) => ({ type: ActionType.UserCardUpdateIsShowAction, isShow, anchorEl, user, onDelete });
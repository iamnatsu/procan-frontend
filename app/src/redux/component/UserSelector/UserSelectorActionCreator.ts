import { ActionType } from '../../ActionType';
import { User } from '../../../model/user';

export const UserSelectorUpdateIsShowAction = (isShow: boolean, anchorEl: HTMLElement | null, onSubmit: () => void) => ({ type: ActionType.UserSelectorUpdateIsShowAction, isShow, anchorEl, onSubmit });
export const UserSelectorUpdateCandidates = (candidates: User[]) => ({ type: ActionType.UserSelectorUpdateCandidates, candidates });
export const UserSelectorUpdateSelections = (selections: { [id: string]: User }) => ({ type: ActionType.UserSelectorUpdateSelections, selections });
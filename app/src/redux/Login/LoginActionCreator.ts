import { ActionType } from '../ActionType';
import { Credential } from '../../types/Credential';

export const UpdateLoginUser = (user: Credential) => { return { type: ActionType.LoginUpdateLoginUser, user } };
export const Destory = () => { return { type: ActionType.LoginDestory } };
export const SetErrorMessage = (errorMessage: string) => { return { type: ActionType.LoginSetErrorMessage, errorMessage } };

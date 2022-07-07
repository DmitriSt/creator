import { CommonStateType } from '../../../models/commonPage.models';
import ActionTypes from '../actionTypes';
import { updateMenu, updateRecommended, updateSocialLinks } from './commonActions';

const defaultState: CommonStateType = {
  menu: null,
  socialLinks: null,
  recommended: null,
};

export type CommonActionType =
  | ReturnType<typeof updateMenu>
  | ReturnType<typeof updateRecommended>
  | ReturnType<typeof updateSocialLinks>;

export function commonDataReducer(state = defaultState, action: CommonActionType) {
  switch (action.type) {
    case ActionTypes.UPDATE_MENU:
      return {
        ...state,
        menu: action.payload,
      };
    case ActionTypes.UPDATE_SOCIAL_LINKS:
      return {
        ...state,
        socialLinks: action.payload,
      };
    case ActionTypes.UPDATE_RECOMMENDED:
      return {
        ...state,
        recommended: action.payload,
      };
    default:
      return state;
  }
}

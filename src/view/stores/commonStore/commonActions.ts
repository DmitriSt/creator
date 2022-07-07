import { ISocialMediaLink, MenuItemType, ProductType } from '../../../models/commonPage.models';
import ActionTypes from '../actionTypes';

export function updateMenu(config: MenuItemType[]) {
  return {
    type: ActionTypes.UPDATE_MENU,
    payload: config,
  } as const;
}

export function updateSocialLinks(config: ISocialMediaLink[]) {
  return {
    type: ActionTypes.UPDATE_SOCIAL_LINKS,
    payload: config,
  } as const;
}

export function updateRecommended(config: ProductType[]) {
  return {
    type: ActionTypes.UPDATE_RECOMMENDED,
    payload: config,
  } as const;
}

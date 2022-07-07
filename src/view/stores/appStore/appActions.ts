import { AppConfigType, ISupportToolScript } from '../../../models/app.models';
import { TestimonialType } from '../../../models/productPage.models';
import ActionTypes from '../actionTypes';

export function initAppStore(config: AppConfigType) {
  return {
    type: ActionTypes.INIT_APP_STORE,
    payload: config,
  } as const;
}

export function updateTestimonials(config: TestimonialType[]) {
  return {
    type: ActionTypes.UPDATE_TESTIMONIALS,
    payload: config,
  } as const;
}

export function updateSupportScripts(config: ISupportToolScript[]) {
  return {
    type: ActionTypes.UPDATE_SUPPORT_SCRIPTS,
    payload: config,
  } as const;
}

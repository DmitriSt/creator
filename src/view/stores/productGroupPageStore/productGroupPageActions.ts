import { SelectorType } from '../../../models/commonPage.models';
import { ProductGroupPageConfigType } from '../../../models/productGroupPage.models';
import ActionTypes from '../actionTypes';

export function initProductGroupPageStore(config: ProductGroupPageConfigType) {
  return {
    type: ActionTypes.INIT_PRODUCTGROUP_PAGE_STORE,
    payload: config,
  } as const;
}

export function setProductGroupPageSelector(selector: SelectorType) {
  return {
    type: ActionTypes.SET_PRODUCTGROUP_PAGE_SELECTOR,
    payload: selector,
  } as const;
}

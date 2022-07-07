import { ProductPageStateType } from '../../../models/productPage.models';
import resetStoreState from '../actions';
import ActionTypes from '../actionTypes';
import initProductPageStore from './productPageActions';

export type ProductPageActionType = ReturnType<typeof initProductPageStore> | ReturnType<typeof resetStoreState>;

const defaultState: ProductPageStateType = {
  isLoaded: false,
  pageConfig: null,
  pageAlert: null,
  details: null,
  footer: null,
  priceCalculatorConfig: null,
};

export function productPageReducer(state = defaultState, action: ProductPageActionType) {
  switch (action.type) {
    case ActionTypes.INIT_PRODUCT_PAGE_STORE:
      return {
        ...state,
        isLoaded: true,
        ...action.payload,
      };
    case ActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}

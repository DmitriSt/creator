import { ProductGroupPageStateType } from '../../../models/productGroupPage.models';
import resetStoreState from '../actions';
import ActionTypes from '../actionTypes';
import { initProductGroupPageStore, setProductGroupPageSelector } from './productGroupPageActions';

export type ProductGroupPageActionType =
  | ReturnType<typeof initProductGroupPageStore>
  | ReturnType<typeof resetStoreState>
  | ReturnType<typeof setProductGroupPageSelector>;

const defaultState: ProductGroupPageStateType = {
  isLoaded: false,
  selector: {},
  pageConfig: null,
  pageAlert: null,
  products: null,
  filtersConfig: null,
  footer: null,
};

export function productGroupPageReducer(state = defaultState, action: ProductGroupPageActionType) {
  switch (action.type) {
    case ActionTypes.INIT_PRODUCTGROUP_PAGE_STORE:
      return {
        ...state,
        ...action.payload,
        isLoaded: true,
        filtersConfig: {
          filters: action.payload.filtersConfig.filter((item) => item.text !== 'Sort'),
          sort: action.payload.filtersConfig.find((item) => item.text === 'Sort') || null,
        },
      };
    case ActionTypes.SET_PRODUCTGROUP_PAGE_SELECTOR:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}

import { ProductPageConfigType } from '../../../models/productPage.models';
import ActionTypes from '../actionTypes';

function initProductPageStore(config: ProductPageConfigType) {
  return {
    type: ActionTypes.INIT_PRODUCT_PAGE_STORE,
    payload: config,
  } as const;
}

export default initProductPageStore;

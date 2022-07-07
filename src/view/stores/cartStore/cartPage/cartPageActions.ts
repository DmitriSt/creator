import { CartPageStateType } from '../../../../models/cart.models';
import ActionTypesCart from '../actionTypes';

export default function initCartPageStore(config: CartPageStateType) {
  return {
    type: ActionTypesCart.INIT_CART_PAGE,
    payload: config,
  } as const;
}

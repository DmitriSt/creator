import { ICart } from '../../../../models/cart.models';
import ActionTypesCart from '../actionTypes';

export function updateStoreCart(config: ICart | null) {
  return {
    type: ActionTypesCart.UPDATE_CART,
    payload: config,
  } as const;
}

export function removeCartItem(id: number) {
  return {
    type: ActionTypesCart.REMOVE_ITEM,
    payload: id,
  } as const;
}

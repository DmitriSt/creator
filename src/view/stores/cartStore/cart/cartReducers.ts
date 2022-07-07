import { ICartStore } from '../../../../models/cart.models';
import ActionTypesCart from '../actionTypes';
import { removeCartItem, updateStoreCart } from './cartActions';

const defaultState: ICartStore = {
  cartId: null,
  currency: null,
  totalAmount: null,
  subTotalAmount: null,
  totalDiscount: null,
  totalShippingAmount: null,
  totalTaxAmount: null,
  toPayTotalTaxAmount: null,
  toPaySubTotalAmount: null,
  toPayTotalShippingAmount: null,
  lineItems: null,
  taxes: null,
};

export type CartActionType = ReturnType<typeof updateStoreCart> | ReturnType<typeof removeCartItem>;

export function cartReducer(state = defaultState, action: CartActionType) {
  switch (action.type) {
    case ActionTypesCart.UPDATE_CART:
      return action.payload || defaultState;
    case ActionTypesCart.REMOVE_ITEM:
      if (state.lineItems) {
        return {
          ...state,
          lineItems: state.lineItems.filter((item) => item.itemId !== action.payload),
        };
      }
      return state;
    default:
      return state;
  }
}

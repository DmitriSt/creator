import { CartPageStateType } from '../../../../models/cart.models';
import { DeliveryWay } from '../../../../models/checkout.models';
import resetStoreState from '../../actions';
import GlobalActionTypes from '../../actionTypes';
import ActionTypesCart from '../actionTypes';
import initCartPageStore from './cartPageActions';

const defaultState: CartPageStateType = {
  showSignIn: false,
  showFooter: false,
  showHeader: false,
  deliveryOptions: DeliveryWay.PickupAndDelivery,
  currencies: {
    symbols: null,
    list: [],
  },
};

export type CartActionType = ReturnType<typeof initCartPageStore> | ReturnType<typeof resetStoreState>;

export function cartPageReducer(state = defaultState, action: CartActionType) {
  switch (action.type) {
    case ActionTypesCart.INIT_CART_PAGE:
      return action.payload;
    case GlobalActionTypes.RESET_STATE:
      return state;
    default:
      return state;
  }
}

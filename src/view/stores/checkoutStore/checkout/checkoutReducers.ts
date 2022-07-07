import { ICheckoutState } from '../../../../models/checkout.models';
import ActionTypes from '../actionTypes';
import { setCountries, setDeliveryRates, setPaymentProviders, setPickupLocations } from './checkoutActions';

const defaultState: ICheckoutState = {
  pickupLocations: null,
  deliveryRates: null,
  countries: null,
  payment: {
    providers: null,
  },
};

export type CheckoutUserActionType =
  | ReturnType<typeof setPickupLocations>
  | ReturnType<typeof setDeliveryRates>
  | ReturnType<typeof setCountries>
  | ReturnType<typeof setPaymentProviders>;

export function checkoutReducer(state = defaultState, action: CheckoutUserActionType) {
  switch (action.type) {
    case ActionTypes.SET_DELIVERY_RATES:
      return {
        ...state,
        deliveryRates: action.payload,
      };
    case ActionTypes.SET_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
      };
    case ActionTypes.SET_PAYMENT_PROVIDERS:
      return {
        ...state,
        payment: {
          ...state.payment,
          providers: action.payload,
        },
      };
    case ActionTypes.SET_PICKUP_LOCATIONS:
      return {
        ...state,
        pickupLocations: action.payload,
      };
    default:
      return state;
  }
}

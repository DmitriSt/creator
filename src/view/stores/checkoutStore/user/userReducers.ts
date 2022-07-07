import { ICheckoutUserState, Section, ShippingWay } from '../../../../models/checkout.models';
import ActionTypes from '../actionTypes';
import {
  resetInfo,
  updateBillingAddress,
  updateCard,
  updateDelivery,
  updateDeliveryInfo,
  updateDeliveryStatus,
  updatePayment,
  updatePaymentStatus,
  updatePickupAddress,
  updateProvider,
  updateSection,
  updateShipping,
  updateShippingAddress,
  updateShippingStatus,
  updateShippingWay,
} from './userActions';

const defaultState: ICheckoutUserState = {
  currentSection: Section.PAYMENT,
  shipping: {
    shippingWay: ShippingWay.SHIP_TO_ADDRESS,
    shippingAddress: {
      firstName: '',
      lastName: '',
      countryCode: '',
      phone1: '',
      address1: '',
      address2: '',
      city: '',
      stateCode: '',
      postalCode: '',
      email: '',
    },
    pickupAddress: null,
    isReady: false,
  },
  delivery: {
    delivery: null,
    isReady: false,
  },
  payment: {
    card: {
      number: '',
      expirationDate: '',
      ownerName: '',
      ccv: '',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      countryCode: '',
      phone1: '',
      address1: '',
      address2: '',
      city: '',
      stateCode: '',
      postalCode: '',
      email: '',
    },
    provider: null,
    isReady: false,
  },
};

export type CheckoutUserActionType =
  | ReturnType<typeof updateShipping>
  | ReturnType<typeof updateShippingStatus>
  | ReturnType<typeof updateShippingAddress>
  | ReturnType<typeof updatePickupAddress>
  | ReturnType<typeof updateShippingWay>
  | ReturnType<typeof updateDelivery>
  | ReturnType<typeof updateDeliveryStatus>
  | ReturnType<typeof updateDeliveryInfo>
  | ReturnType<typeof updatePayment>
  | ReturnType<typeof updatePaymentStatus>
  | ReturnType<typeof updateBillingAddress>
  | ReturnType<typeof updateCard>
  | ReturnType<typeof resetInfo>
  | ReturnType<typeof updateSection>
  | ReturnType<typeof updateProvider>;

export function userReducer(state = defaultState, action: CheckoutUserActionType) {
  switch (action.type) {
    case ActionTypes.UPDATE_SHIPPING:
      return {
        ...state,
        shipping: action.payload,
      };
    case ActionTypes.UPDATE_SECTION:
      return {
        ...state,
        currentSection: action.payload,
      };
    case ActionTypes.UPDATE_SHIPPING_STATUS:
      return {
        ...state,
        shipping: {
          ...state.shipping,
          isReady: action.payload,
        },
      };
    case ActionTypes.UPDATE_SHIPPING_ADDRESS:
      return {
        ...state,
        shipping: {
          ...state.shipping,
          shippingAddress: action.payload,
        },
      };
    case ActionTypes.UPDATE_PICKUP_ADDRESS:
      return {
        ...state,
        shipping: {
          ...state.shipping,
          pickupAddress: action.payload,
        },
      };
    case ActionTypes.UPDATE_SHIPPING_WAY:
      return {
        ...state,
        shipping: {
          ...state.shipping,
          shippingWay: action.payload,
        },
      };
    case ActionTypes.UPDATE_PAYMENT:
      return {
        ...state,
        payment: action.payload,
      };
    case ActionTypes.UPDATE_PAYMENT_STATUS:
      return {
        ...state,
        payment: {
          ...state.payment,
          isReady: action.payload,
        },
      };
    case ActionTypes.UPDATE_BILLING_ADDRESS:
      return {
        ...state,
        payment: {
          ...state.payment,
          billingAddress: action.payload,
        },
      };
    case ActionTypes.UPDATE_CARD:
      return {
        ...state,
        payment: {
          ...state.payment,
          card: action.payload,
        },
      };
    case ActionTypes.RESET_INFO:
      return {
        ...state,
        currentSection: Section.SHIPPING,
        payment: {
          ...state.payment,
          card: {
            number: '',
            expirationDate: '',
            ownerName: '',
            ccv: '',
          },
        },
      };
    case ActionTypes.UPDATE_PROVIDER:
      return {
        ...state,
        payment: {
          ...state.payment,
          provider: action.payload,
        },
      };
    case ActionTypes.UPDATE_DELIVERY_INFO:
      return {
        ...state,
        delivery: action.payload,
      };
    case ActionTypes.UPDATE_DELIVERY:
      return {
        ...state,
        delivery: {
          ...state.delivery,
          delivery: action.payload,
        },
      };
    case ActionTypes.UPDATE_DELIVERY_STATUS:
      return {
        ...state,
        delivery: {
          ...state.delivery,
          isReady: action.payload,
        },
      };
    default:
      return state;
  }
}

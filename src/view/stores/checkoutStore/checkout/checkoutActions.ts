import { DeliveryRate, ICountryWithState, PaymentProvider, PickupLocation } from '../../../../models/checkout.models';
import ActionTypes from '../actionTypes';

export function setPickupLocations(dto: PickupLocation[]) {
  return {
    type: ActionTypes.SET_PICKUP_LOCATIONS,
    payload: dto,
  } as const;
}

export function setCountries(dto: ICountryWithState[]) {
  return {
    type: ActionTypes.SET_COUNTRIES,
    payload: dto,
  } as const;
}
export function setDeliveryRates(status: DeliveryRate) {
  return {
    type: ActionTypes.SET_DELIVERY_RATES,
    payload: status,
  } as const;
}

export function setPaymentProviders(dto: PaymentProvider[]) {
  return {
    type: ActionTypes.SET_PAYMENT_PROVIDERS,
    payload: dto,
  } as const;
}

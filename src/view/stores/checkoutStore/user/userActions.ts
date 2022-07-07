import {
  DeliveryRateOption,
  ICardInfo,
  IDeliveryInfo,
  IPayment,
  IShipping,
  IShippingAddress,
  PaymentProvider,
  PickupLocation,
  Section,
  ShippingWay,
} from '../../../../models/checkout.models';
import ActionTypes from '../actionTypes';

export function updateSection(dto: Section) {
  return {
    type: ActionTypes.UPDATE_SECTION,
    payload: dto,
  } as const;
}

export function updateShipping(dto: IShipping) {
  return {
    type: ActionTypes.UPDATE_SHIPPING,
    payload: dto,
  } as const;
}

export function updateShippingStatus(status: boolean) {
  return {
    type: ActionTypes.UPDATE_SHIPPING_STATUS,
    payload: status,
  } as const;
}

export function updateShippingAddress(dto: IShippingAddress) {
  return {
    type: ActionTypes.UPDATE_SHIPPING_ADDRESS,
    payload: dto,
  } as const;
}

export function updatePickupAddress(dto: PickupLocation) {
  return {
    type: ActionTypes.UPDATE_PICKUP_ADDRESS,
    payload: dto,
  } as const;
}

export function updateShippingWay(dto: ShippingWay) {
  return {
    type: ActionTypes.UPDATE_SHIPPING_WAY,
    payload: dto,
  } as const;
}

export function updateDeliveryInfo(dto: IDeliveryInfo) {
  return {
    type: ActionTypes.UPDATE_DELIVERY_INFO,
    payload: dto,
  } as const;
}

export function updateDelivery(dto: DeliveryRateOption | null) {
  return {
    type: ActionTypes.UPDATE_DELIVERY,
    payload: dto,
  } as const;
}

export function updateDeliveryStatus(dto: boolean) {
  return {
    type: ActionTypes.UPDATE_DELIVERY_STATUS,
    payload: dto,
  } as const;
}

export function updatePayment(dto: IPayment) {
  return {
    type: ActionTypes.UPDATE_PAYMENT,
    payload: dto,
  } as const;
}

export function updateBillingAddress(dto: IShippingAddress | null) {
  return {
    type: ActionTypes.UPDATE_BILLING_ADDRESS,
    payload: dto,
  } as const;
}

export function updateCard(dto: ICardInfo) {
  return {
    type: ActionTypes.UPDATE_CARD,
    payload: dto,
  } as const;
}

export function resetInfo() {
  return {
    type: ActionTypes.RESET_INFO,
  } as const;
}

export function updateProvider(dto: PaymentProvider) {
  return {
    type: ActionTypes.UPDATE_PROVIDER,
    payload: dto,
  } as const;
}

export function updatePaymentStatus(dto: boolean) {
  return {
    type: ActionTypes.UPDATE_PAYMENT_STATUS,
    payload: dto,
  } as const;
}

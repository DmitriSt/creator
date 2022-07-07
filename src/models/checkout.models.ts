import { IFilterConfigItem } from './commonPage.models';

export interface ICheckoutUserState {
  currentSection: Section | null;
  shipping: IShipping;
  delivery: IDeliveryInfo;
  payment: IPayment;
}

export interface ICheckoutState {
  pickupLocations: PickupLocation[] | null;
  deliveryRates: DeliveryRate | null;
  payment: CheckoutPayment;
  countries: ICountryWithState[] | null;
}

export interface IShipping {
  shippingWay: ShippingWay;
  shippingAddress: IShippingAddress;
  pickupAddress: PickupLocation | null;
  isReady: boolean;
}

export interface IDeliveryInfo {
  isReady: boolean;
  delivery: DeliveryRateOption | null;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone1: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  postalCode: string;
  email: string;
}

export enum ShippingWay {
  PICKUP = 'PICKUP',
  SHIP_TO_ADDRESS = 'SHIP_TO_ADDRESS',
}

export enum DeliveryWay {
  Delivery = 1,
  Pickup,
  PickupAndDelivery,
}

export enum Section {
  SHIPPING = 'SHIPPING',
  DELIVERY = 'DELIVERY',
  PAYMENT = 'PAYMENT',
}

export interface IDelivery {
  id: string;
  delivery: string;
  price: number;
  description: string;
}

export interface IPayment {
  card: ICardInfo;
  provider: PaymentProvider | null;
  billingAddress: IShippingAddress;
  isReady: boolean;
}

export interface IPickupAddress {
  companyName: string;
  apartmentNumber: string;
  address1: string;
  address2: string;
  city: string;
  countryCode: string;
  stateCode: string;
  postalCode: string;
  id: string;
  text: string;
}

export interface ICountryItem {
  code: string;
  name: string;
}

export interface ICountryWithState extends ICountryItem {
  states: ICountryItem[];
}

export type Variant = {
  id: string;
  delivery: string;
  price: number;
  description: string;
};

export interface ICardInfo {
  number: string;
  expirationDate: string;
  ownerName: string;
  ccv: string;
}

export type SectionPropsType = {
  isOpen: boolean;
  isVisited?: boolean;
};

export type RawPickupLocation = {
  address: IPickupAddress;
  locationId: string;
  pickupCost: string;
  openingHours: WorkingHours[];
};

export type PickupLocation = {
  address: IPickupAddress;
  fullAddress: string;
  locationId: string;
  pickupCost: string;
  openingHours: MappedWorkingHours[];
};

export type WorkingHours = {
  endTime: number;
  pickupDay: WeekDays;
  startTime: number;
};

export type MappedWorkingHours = {
  endTime: number;
  pickupDay: WeekDays;
  startTime: number;
  isClosed?: boolean;
};

export type PickupLocationAddress = {
  address: IPickupAddress;
  locationId: number;
  pickupCost: string;
  openingHours: WorkingHours[];
};

export enum WeekDays {
  MONDAY = 0,
  TUESDAYFRIDAY = 1,
  SATURDAY = 3,
  SUNDAY = 4,
}

export type MappedCountries = {
  states: States;
  countries: IFilterConfigItem[];
};

export type States = {
  [key: string]: IFilterConfigItem[];
};

export type DeliveryRateConfig = {
  chosenRate: DeliveryRateOption;
  rateConfig: DeliveryRate;
};

export type DeliveryRate = {
  provider: string;
  image: string;
  selectedValue: string;
  options: DeliveryRateOption[];
};

export type DeliveryCuttedRateOption = {
  code: string;
  name: string;
};

export type DeliveryRateOption = {
  code: string;
  name: string;
  ratePrice: number;
  comment: string;
  discount: number;
};

export type CheckoutPayment = {
  providers: PaymentProvider[] | null;
};

export type PaymentProvider = {
  ccTypes: number;
  type: PaymentType;
  provider: string;
};

export enum PaymentType {
  DIRECT_PAY = 1,
  EXPRESS_PAY,
}

export type PaymentProviderInfo = {
  data: PaymentProviderData;
  serviceUrl: string;
};

export type PaymentProviderData = {
  address_override: string;
  amount: string;
  bn: string;
  business: string;
  cancel_return: string;
  cmd: string;
  currency_code: string;
  custom: string;
  invoice: string;
  item_name: string;
  item_number: string;
  no_shipping: string;
  notify_url: string;
  quantity: string;
  return: string;
  rm: string;
  tax?: string;
};

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  companyName: string;
  apartmentNumber: string;
  address1: string;
  address2: string;
  phone1: string;
  phone2: string;
  email: string;
  city: string;
  countryCode: string;
  stateCode: string;
  postalCode: string;
}

export type CCPayDTO = {
  expiryMonth: number;
  expiryYear: number;
  cardNumber: number;
  securityCode: string;
  cardType: string;
};

export enum PaymentResponseCode {
  None,
  Approved,
  Declined,
  Error,
}

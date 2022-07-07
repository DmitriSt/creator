import {
  CCPayDTO,
  DeliveryCuttedRateOption,
  DeliveryRateOption,
  ICardInfo,
  IPickupAddress,
  IShippingAddress,
  MappedWorkingHours,
  PickupLocation,
  ShippingWay,
  WeekDays,
  WorkingHours,
} from '../../models/checkout.models';
import { filterNumbers } from './inputMasks';

const regexpForEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string) {
  return regexpForEmail.test(email);
}

export function isEmpty(obj: IShippingAddress) {
  if (!obj) return true;
  const targetArr = Object.entries(obj) as [keyof IShippingAddress, string][];
  return targetArr.every((item) => !item[1]);
}

function validateObject(obj: IShippingAddress, skipFields: (keyof IShippingAddress)[] = []) {
  const targetArr = Object.entries(obj) as [keyof IShippingAddress, string][];
  const emptyEl = targetArr.find((item) => !skipFields.includes(item[0]) && !item[1]);
  const isEmailValid = validateEmail(obj.email);
  return !emptyEl && isEmailValid;
}

export function validateAddress(addressInfo: IShippingAddress) {
  return validateObject(addressInfo, ['address2']);
}

export function validateCard(card: ICardInfo) {
  const { ccv, number, expirationDate, ownerName } = card;

  const cleanedNumber = number.split(' ').join('');
  if (cleanedNumber.length < 16) return false;
  const isValidNumber = typeof +cleanedNumber === 'number' && !Number.isNaN(+cleanedNumber);
  if (!isValidNumber) return false;

  if (ccv.length < 3) return false;
  const isValidCCV = typeof +ccv === 'number' && !Number.isNaN(+ccv);
  if (!isValidCCV) return false;

  const cleanedDate = expirationDate.split('/').join('');
  if (cleanedDate.length < 4) return false;
  const isValidDate = typeof +cleanedDate === 'number' && !Number.isNaN(+cleanedDate);
  if (!isValidDate) return false;

  if (!ownerName.length) return false;

  return true;
}

export function generateFullAddress(address: IShippingAddress) {
  const { address1, city, stateCode, countryCode, postalCode } = address;
  return `${address1}\n${city}, ${stateCode} ${postalCode}, ${countryCode}`;
}

export function isAddressesEqual(var1: IShippingAddress, var2: IShippingAddress) {
  return (
    var1.city === var2.city &&
    var1.firstName === var2.firstName &&
    var1.countryCode === var2.countryCode &&
    var1.email === var2.email &&
    var1.lastName === var2.lastName &&
    var1.phone1 === var2.phone1 &&
    var1.postalCode === var2.postalCode &&
    var1.stateCode === var2.stateCode &&
    var1.address1 === var2.address1 &&
    var1.address2 === var2.address2
  );
}

export function generatePickupAddress(address: IPickupAddress) {
  const { address1, address2, stateCode, countryCode, city, postalCode } = address;
  return `${address1} ${address2}\n${city}, ${stateCode} ${postalCode}, ${countryCode}`;
}

export function formatOpeningHours(hours: WorkingHours[]): MappedWorkingHours[] {
  return [WeekDays.MONDAY, WeekDays.TUESDAYFRIDAY, WeekDays.SATURDAY, WeekDays.SUNDAY].map((item) => {
    const target = hours.find((hour) => hour.pickupDay === item);
    if (target) return target;
    return {
      pickupDay: item,
      endTime: 0,
      startTime: 0,
      isClosed: true,
    };
  });
}

function getHour(hour: number) {
  if (hour === 0 || hour === 12) return 12;
  return hour < 12 ? hour : hour - 12;
}

function extractTime(raw: number) {
  const rawHour = Number.parseInt(`${raw / 100}`, 10);
  const dayPeriod = rawHour < 12 ? 'a.m.' : 'p.m.';
  const minutes = raw - rawHour * 100;
  return `${getHour(rawHour)}.${minutes < 10 ? `0${minutes}` : minutes} ${dayPeriod}`;
}

export function getWorkingHours(startTime: number, endTime: number) {
  const start = extractTime(startTime);
  const end = extractTime(endTime);
  return `${start} — ${end}`;
}

function defineCardType(cardNumber: string): [string, number] {
  const number = filterNumbers(cardNumber.split(''));
  return ['8', +number.join('')];
}

export function generateCardDTO(card: ICardInfo): CCPayDTO {
  const { number, expirationDate, ccv } = card;
  const [month, year] = expirationDate.split('/');
  const [cardType, cardNumber] = defineCardType(number);
  return {
    cardNumber,
    securityCode: ccv,
    cardType,
    expiryMonth: +month,
    expiryYear: +year,
  };
}

export function getIDFromQuery(id = 's') {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(id);
}

export function setCheckoutInfo(shippingWay: ShippingWay, pickupAddress: PickupLocation, delivery: DeliveryRateOption) {
  sessionStorage.setItem('way', shippingWay);
  if (shippingWay === ShippingWay.PICKUP && pickupAddress) {
    sessionStorage.setItem('locationId', `${pickupAddress.locationId}`);
  }
  if (shippingWay === ShippingWay.SHIP_TO_ADDRESS && delivery) {
    const dto: DeliveryCuttedRateOption = {
      code: delivery.code,
      name: delivery.name,
    };
    sessionStorage.setItem('delivery', JSON.stringify(dto));
  }
}

export function getCheckoutInfo() {
  const way = sessionStorage.getItem('way') as ShippingWay;
  const locationId = sessionStorage.getItem('locationId');
  const rawDeliveryCode = sessionStorage.getItem('delivery');
  if (!way && !locationId && !rawDeliveryCode) return null;
  const delivery: DeliveryCuttedRateOption = JSON.parse(rawDeliveryCode);
  return {
    way,
    locationId,
    delivery,
  };
}

export function removeCheckoutInfo() {
  sessionStorage.removeItem('way');
  sessionStorage.removeItem('locationId');
  sessionStorage.removeItem('delivery');
}

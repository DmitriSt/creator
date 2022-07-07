import { DeliveryWay } from './checkout.models';
import { IBaseObj } from './commonPage.models';

export interface ICart {
  cartId: number;
  currency: string;
  totalAmount: number;
  subTotalAmount: number;
  totalDiscount: number;
  totalShippingAmount: number;
  totalTaxAmount: number;
  toPayTotalTaxAmount: number;
  toPaySubTotalAmount: number;
  toPayTotalShippingAmount: number;
  lineItems: ICartItem[];
  taxes: ICartTax[];
}

export interface ICartStore {
  cartId: number | null;
  currency: string | null;
  totalAmount: number | null;
  subTotalAmount: number | null;
  totalDiscount: number | null;
  totalShippingAmount: number | null;
  totalTaxAmount: number | null;
  toPayTotalTaxAmount: number | null;
  toPaySubTotalAmount: number | null;
  toPayTotalShippingAmount: number | null;
  lineItems: ICartItem[] | null;
  taxes: ICartTax[] | null;
}

export interface ICartItem {
  itemId: number;
  productId: number;
  designId: string;
  designer: CartItemDesignType;
  quantity: number;
  description: string;
  price: number;
  shipping: number;
  shippingService: string;
  discounts: ICartDiscount[];
  options: ICartItemOptions[];
}

export enum CartItemDesignType {
  None = 0,
  Quick = 1,
  Mini = 2,
  Full = 4,
  Upload = 8,
}

export interface IActiveCartItem {
  item: ICartItem | null;
}

export interface ICartTax {
  name: string;
  amount: number;
  rate: number;
}

export interface ICartDiscount {
  couponCode: string;
  isFreeShipping: boolean;
  total: number;
}

export interface ICartItemOptions {
  text: string;
  type: number;
  description: string;
  selectedValue: string;
  items: IOptionItem[];
}

export interface IOptionItem {
  text: string;
  value: string;
}

export interface ITextItem {
  valueRight: string;
  valueLeft: string;
}

type CartPageBaseConfig<T> = {
  showSignIn: boolean;
  showFooter: boolean;
  showHeader: boolean;
  deliveryOptions: DeliveryWay;
  currencies: T;
};

export type CartPageConfig = CartPageBaseConfig<Currency[]>;
export type CartPageStateType = CartPageBaseConfig<CurrencyMap>;

export type CurrencyMap = {
  list: Currency[];
  symbols: IBaseObj;
};

export type Currency = {
  code: string;
  symbol?: string;
  text: string;
};

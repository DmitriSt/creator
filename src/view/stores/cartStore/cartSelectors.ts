import { ITextItem } from '../../../models/cart.models';
import { getRoundedNumber, getRoundedPrice } from '../../helpers/cartHelpers';
import { RootStateType } from '../store';

export const getCartTotal = (state: RootStateType) => {
  const { subTotalAmount, totalDiscount, totalTaxAmount, totalShippingAmount } = state.cartState.cart;
  return (
    getRoundedNumber(subTotalAmount) +
    getRoundedNumber(totalTaxAmount) +
    getRoundedNumber(totalShippingAmount) -
    getRoundedNumber(totalDiscount)
  );
};

export const getCartSubtotal = (state: RootStateType) => state.cartState.cart.subTotalAmount;

export const cartCurrencySign = (state: RootStateType) => {
  const currency = state.cartState.cart.currency;
  return `${state.cartState.cartPage.currencies.symbols[currency]} `;
};

export const getSummaryInfo = (state: RootStateType) => {
  const { subTotalAmount, totalDiscount, totalTaxAmount, totalShippingAmount } = state.cartState.cart;
  const currency = cartCurrencySign(state);
  const subtotal = subTotalAmount || 0;
  const tax = totalTaxAmount || 0;
  const shipping = totalShippingAmount || 0;
  const cartItems = state.cartState.cart.lineItems;
  const itemsText = cartItems ? `(${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'})` : '';
  const items: ITextItem[] = [
    {
      valueLeft: `Subtotal ${itemsText}`,
      valueRight: getRoundedPrice(subtotal, currency),
    },
    {
      valueLeft: 'Shipping',
      valueRight: getRoundedPrice(shipping, currency),
    },
    {
      valueLeft: 'TAX',
      valueRight: getRoundedPrice(tax, currency),
    },
  ];
  if (totalDiscount) {
    items.splice(2, 0, {
      valueLeft: 'Discount',
      valueRight: `(${getRoundedPrice(totalDiscount, currency)})`,
    });
  }
  return { items, currency };
};

export const getCartSummaryInfo = (state: RootStateType) => {
  const { items } = getSummaryInfo(state);
  return items;
};

export const getOrderSummaryInfo = (state: RootStateType) => {
  const total = getCartTotal(state);
  const { items, currency } = getSummaryInfo(state);
  if (typeof total === 'number') {
    items.push({
      valueLeft: 'TOTAL',
      valueRight: getRoundedPrice(total, currency),
    });
  }
  return items;
};

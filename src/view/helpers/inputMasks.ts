export function filterNumbers(value: string[]) {
  return value.filter((item) => item !== ' ' && typeof +item === 'number' && !Number.isNaN(+item));
}

// enum Card {
//   VISA = 'VISA',
//   VISA_ELECTRON = 'VISA_ELECTRON',
//   MAESTRO = 'MAESTRO',
//   MASTERCARD = 'MASTERCARD',
//   AMEX = 'AMEX',
//   OTHER = 'OTHER',
// }
// const mastercardRegexp = '^5[1-5]';
// const visaRegexp = '^4';
// const visaElectronRegexp = '^5[1-5]';
// const amexRegexp = '^3[47]';
// const maestroRegexp = '^(50(18|20|38)|5612|5893|63(04|90)|67(59|6[1-3])|0604)';

// const currentFullYear = new Date().getFullYear();
// const maxYear = (currentFullYear % 100) + 5;
// const [decade, year] = `${maxYear}`.split('');

function filterExpDate(value: string[]) {
  return value.filter((item, index) => {
    if (index === 2 && item === '/') {
      return true;
    }
    return item !== ' ' && typeof +item === 'number' && !Number.isNaN(+item);
  });
}

function validateExpDate(value: string[]) {
  let filteredValue = filterExpDate(value);
  if (filteredValue.length === 1) {
    if (+filteredValue[0] > 1) {
      filteredValue = ['0', ...filteredValue];
    }
  }
  return filteredValue.reduce((total, item, index) => {
    if (total.length >= 5) return total;
    total = `${total}${item}`;
    if (index === 1 && total.length === 2 && filteredValue[2] !== '/') {
      total = `${total}/`;
    }
    return total;
  }, '');
}

function applyDefaultMask(value: string[]) {
  let count = 0;
  return value.reduce((total, item) => {
    if (total.length >= 22) return total;
    count++;
    total = `${total}${item}`;
    if (count === 5) {
      count = 1;
      total = `${total.slice(0, total.length - 1)}  ${total.slice(-1)}`;
    }
    return total;
  }, '');
}

function createExpirationDateWrapper() {
  let prevValue = '';
  function createExpirationDate(value: string, sourceValue: string) {
    if (value.length === 3) {
      const text = `${sourceValue}/` === value && value === prevValue && value.endsWith('/') ? value[0] : value;
      prevValue = text;
      return text;
    }
    prevValue = value;
    return value;
  }
  return createExpirationDate;
}

const createExpirationDate = createExpirationDateWrapper();

// function defineCard(number: string) {
//   if (number.match(mastercardRegexp) != null) return Card.MASTERCARD;
//   if (number.match(visaRegexp) != null) return Card.VISA;
//   if (number.match(amexRegexp) != null) return Card.AMEX;
//   if (number.match(visaElectronRegexp) != null) return Card.VISA_ELECTRON;
//   if (number.match(maestroRegexp) != null) return Card.MAESTRO;
//   return Card.OTHER;
// }

function applyCardNumberMask(value: string) {
  const filteredVal = value.length ? filterNumbers(value.split('')) : value;
  if (typeof filteredVal === 'string') return filteredVal;
  // const cardType = defineCard(filteredVal.join(''));
  return applyDefaultMask(filteredVal);
}

function applyCardExpirationDateMask(value: string) {
  // const filteredVal = value.length ? filterNumbers(value.split('')) : value;
  // return typeof filteredVal === 'string' ? value : createExpirationDate(filteredVal);
  // return createExpirationDate(value);
  const val = value.length ? validateExpDate(value.split('')) : value;
  return createExpirationDate(val, value);
}

function applyCardCCVMask(value: string) {
  if (value.length > 3) return value.slice(0, 3);
  const filteredVal = value.length ? filterNumbers(value.split('')) : value;
  return typeof filteredVal === 'string' ? value : filteredVal.join('');
}

export { applyCardCCVMask, applyCardExpirationDateMask, applyCardNumberMask };

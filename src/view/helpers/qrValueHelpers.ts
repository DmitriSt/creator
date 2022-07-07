import Text from '../../business/elements/Text';
import { QRElementValue, TextTypes } from '../../models/constants/designer';
import { FormatTypes, MaintainedQRFormats } from '../../models/designer/qr.models';

function clearTextValue(text: string) {
  const element = document.createElement('span');
  element.innerHTML = text;
  return element.innerText;
}

export const maintainedQRFormat = [FormatTypes.MeCard, FormatTypes.VCard, FormatTypes.Email, FormatTypes.Phone];

export function generateQRValue<T>(qrType: MaintainedQRFormats, textMap: Map<string, Text>, value: T): T | null {
  const valueMap = QRElementValue[qrType];
  const keys = Object.keys(valueMap);
  let copyValue = { ...value };
  keys.forEach((key) => {
    const keyValue = valueMap[key];
    if (!keyValue) return;
    if (Array.isArray(keyValue)) {
      for (let i = 0; i < keyValue.length; i++) {
        const el = keyValue[i];
        const textElem = textMap.get(TextTypes[el]);
        if (textElem) {
          copyValue = {
            ...copyValue,
            [key]: clearTextValue(textElem.text),
          };
          return;
        }
      }
    } else {
      const textElem = textMap.get(TextTypes[keyValue]);
      if (textElem) {
        copyValue = {
          ...copyValue,
          [key]: clearTextValue(textElem.text),
        };
      }
    }
  });
  return Object.keys(copyValue).length ? copyValue : null;
}

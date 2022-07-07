import axios from 'axios';

import consts from '../../models/constants/consts';

function getFloat(float: string | undefined) {
  if (!float) return '00';
  if (float.length > 2) return float.slice(0, 2);
  if (float.length === 2) return float;
  return `${float}0`;
}

export function getRoundedNumber(price: number) {
  return Math.round((price + Number.EPSILON) * 100) / 100;
}

export function getRoundedPrice(price: number, currency: string) {
  return `${currency}${getRoundedNumber(price).toFixed(2)}`;
}

export function getPrecisionPrice(price: number, currency: string) {
  const [int, float] = `${price}`.split('.');
  return `${currency}${`${int}.${getFloat(float)}`}`;
}

export function getImageUrl(designId: string) {
  return `${consts.designer.API}Images/preview/${designId}`;
  // 21D.BO90.HDZ/pageId/canvasId
}

export async function getDesignPreview(url: string): Promise<string> {
  return (await axios.get(url)).data;
}

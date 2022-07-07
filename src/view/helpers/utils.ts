import { IWithImage } from '../../business/interfaces/featuresInterfaces';
import { IPosition, IVector } from '../../business/interfaces/interfaces';
import { UTCDateInfo } from '../../models/commonPage.models';
import consts, { updateColor } from '../../models/constants/consts';

export function between(test: number, min: number, max: number): number {
  if (test < min) return min;
  if (test > max) return max;
  return test;
}

// negative angle due to clockwise rotation
export function toRadian(degrees: number): number {
  return (Math.PI * -degrees) / 180;
}

export function getDiag(w: number, h: number) {
  return Math.sqrt(w ** 2 + h ** 2) / 2;
}

export function getDistPoints(pos1: IPosition, pos2: IPosition) {
  const w = pos2.x - pos1.x;
  const h = pos2.y - pos1.y;
  return getDiag(w, h);
}

export function rotateByAxes(vector: IVector, rad: number): IVector {
  return {
    x: vector.x * Math.cos(rad) + vector.y * Math.sin(rad),
    y: vector.y * Math.cos(rad) - vector.x * Math.sin(rad),
  };
}

export function getSuitableImageSize(imageEl: IWithImage, width: number) {
  if (imageEl.url && (imageEl.source === imageEl.url || width > consts.imageSizes.MEDIUM)) {
    return imageEl.url;
  }
  return imageEl.mediumUrl;
}

export function getUTCDate(dateString?: string): UTCDateInfo {
  const date = dateString ? new Date(dateString) : new Date();
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth() + 1;
  const utcMonthDay = date.getUTCDate();
  const utcHour = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcMiliseconds = date.getUTCMilliseconds();
  const utcDate = `${utcMonthDay}/${utcMonth}/${utcYear}-${utcHour}:${utcMinutes}:${utcMiliseconds}`;
  const timestamp = date.getTime();
  return {
    utcDate,
    timestamp,
    values: {
      utcYear,
      utcMonth,
      utcMonthDay,
      utcHour,
      utcMinutes,
      utcMiliseconds,
    },
  };
}

function generateCoef(diff: number): number {
  if (diff <= 2) {
    return 6;
  }
  if (diff >= 2 && diff < 8) {
    return 3;
  }
  if (diff >= 8 && diff < 20) {
    return 2;
  }
  return 1;
}

export function generateStrokeWidth(width: number, height: number): number {
  const standart = (1350 * 810) / 1000000;
  const canvasSquare = (width * height) / 1000000;
  const diff = canvasSquare / standart;
  const coeff = generateCoef(diff);
  const value = (canvasSquare / standart) * coeff;
  return +value.toFixed(1);
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

export function applyBrandColor(color: string) {
  if (!color) return;
  const rgbValues = hexToRgb(color);
  if (!rgbValues) return;
  const [r, g, b] = rgbValues;
  document.documentElement.style.setProperty('--brand-color', color);
  updateColor(color);
  document.documentElement.style.setProperty('--raw-brand-color', `${r}, ${g}, ${b}`);
  document.documentElement.style.setProperty('--brand-color-darkish', `rgb(${r / 3}, ${g / 3}, ${b / 3})`);
}

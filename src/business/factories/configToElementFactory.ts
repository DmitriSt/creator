import DOMPurify from 'dompurify';

import { ElementTypes, TextFontType } from '../../models/constants/designer';
import { FormatTypes } from '../../models/designer/qr.models';
import BackgroundColor from '../elements/BackgroundColor';
import BackgroundImage from '../elements/BackgroundImage';
import BaseElement from '../elements/BaseElement';
import Image from '../elements/Image';
import QR from '../elements/QR';
import QREmail from '../elements/QREmail';
import QRMeCard from '../elements/QRMeCard';
import QRPhone from '../elements/QRPhone';
import QRText from '../elements/QRText';
import QRVCard from '../elements/QRVCard';
import Sticker from '../elements/Sticker';
import Text from '../elements/Text';
import {
  IBackgroundColorElementConfig,
  IBackgroundImageElementConfig,
  ICropLimitsConfig,
  IElementConfig,
  IFlipConfig,
  IImageElementConfig,
  IQRElementConfig,
  IStickerElementConfig,
  ITextElementConfig,
} from '../interfaces/configsInterfaces';
import { IWithColor, IWithTextFamily, IWithTextSize, IWithTextValue } from '../interfaces/featuresInterfaces';
import { ICrop, IDimension, IFlip } from '../interfaces/interfaces';

export function parseFlip(element: IFlipConfig): IFlip {
  if (!element) {
    return {
      horizontal: false,
      vertical: false,
    };
  }
  return {
    horizontal: element.horizontalFlip,
    vertical: element.verticalFlip,
  };
}

export function parseCrop(crop: ICropLimitsConfig, ref: IDimension): ICrop {
  if (!crop) {
    return {
      x: ref.width / 2,
      y: ref.height / 2,
      width: ref.width,
      height: ref.height,
    };
  }
  return {
    x: crop.left + crop.width / 2,
    y: crop.top + crop.height / 2,
    width: crop.width,
    height: crop.height,
  };
}

export function extractTextProps(text: string): IWithTextValue & IWithTextSize & IWithTextFamily & IWithColor {
  const dom = document.createElement('div');
  dom.innerHTML = DOMPurify.sanitize(text.trim());
  const span = dom.firstElementChild as HTMLSpanElement;
  if (span.tagName !== 'SPAN') {
    return {
      text: dom.innerHTML,
      fontFamily: null,
      fontSize: null,
      color: null,
    };
  }
  return {
    text: span.innerHTML,
    fontFamily: (span.style.fontFamily as TextFontType) || null,
    fontSize: parseInt(span.style.fontSize, 10) || null,
    color: span.style.color || null,
  };
}

function createImageElement(element: IImageElementConfig): Image {
  return new Image(
    element.left + element.width / 2,
    element.top + element.height / 2,
    element.width,
    element.height,
    element.originalWidth,
    element.originalHeight,
    element.source,
    element.thumbUrl || element.source,
    element.mediumUrl || element.source,
    element.url || element.source,
    element.rotation,
    parseFlip(element),
    parseCrop(element.crop, element),
    element.filters,
    !element.source
  );
}

function createBackgroundImageElement(element: IBackgroundImageElementConfig, canvas: IDimension): BaseElement {
  const ref: IDimension = {
    width: element.originalWidth,
    height: element.originalHeight,
  };
  return new BackgroundImage(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width,
    canvas.height,
    element.originalWidth,
    element.originalHeight,
    element.source,
    element.thumbUrl,
    element.mediumUrl,
    element.url,
    parseFlip(element),
    parseCrop(element.crop, ref),
    element.filters
  );
}

function createBackgroundColorElement(element: IBackgroundColorElementConfig, canvas: IDimension): BaseElement {
  return new BackgroundColor(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, element.color);
}

function createQRElement(element: IQRElementConfig): QR<unknown> {
  switch (element.format) {
    case FormatTypes.MeCard:
      return new QRMeCard(
        element.left + element.width / 2,
        element.top + element.height / 2,
        element.width,
        element.height,
        element.value,
        element.color,
        element.rotation
      );
    case FormatTypes.VCard:
      return new QRVCard(
        element.left + element.width / 2,
        element.top + element.height / 2,
        element.width,
        element.height,
        element.value,
        element.color,
        element.rotation
      );
    case FormatTypes.Email:
      return new QREmail(
        element.left + element.width / 2,
        element.top + element.height / 2,
        element.width,
        element.height,
        element.value,
        element.color,
        element.rotation
      );
    case FormatTypes.Phone:
      return new QRPhone(
        element.left + element.width / 2,
        element.top + element.height / 2,
        element.width,
        element.height,
        element.value,
        element.color,
        element.rotation
      );
    case FormatTypes.URL:
    case FormatTypes.Text:
      return new QRText(
        element.left + element.width / 2,
        element.top + element.height / 2,
        element.width,
        element.height,
        element.value,
        element.color,
        element.rotation
      );
    default:
      throw new Error('Unsupported QR type');
  }
}

function createStickerElement(element: IStickerElementConfig): Sticker {
  return new Sticker(
    element.left + element.width / 2,
    element.top + element.height / 2,
    element.width,
    element.height,
    element.originalWidth,
    element.originalHeight,
    element.source,
    element.thumbUrl,
    element.mediumUrl,
    element.url,
    element.color,
    element.rotation,
    parseFlip(element),
    parseCrop(element.crop, element)
  );
}

function createTextElement(element: ITextElementConfig): Text {
  const textProps = extractTextProps(element.text);
  return new Text(
    element.left + element.width / 2,
    element.top + element.height / 2,
    element.width,
    element.height,
    textProps.text,
    element.placeholder,
    element.manuallyResized,
    element.color,
    textProps.fontFamily,
    textProps.fontSize,
    element.align,
    element.rotation,
    element.textType
  );
}

export default function createCanvasElement(element: IElementConfig, canvas: IDimension): BaseElement {
  switch (element.type) {
    case ElementTypes.Image:
      return createImageElement(element as IImageElementConfig);
    case ElementTypes.Clipart:
      return createStickerElement(element as IStickerElementConfig);
    case ElementTypes.BackgroundImage:
      return createBackgroundImageElement(element as IBackgroundImageElementConfig, canvas);
    case ElementTypes.BackgroundColor:
      return createBackgroundColorElement(element as IBackgroundColorElementConfig, canvas);
    case ElementTypes.QR:
      return createQRElement(element as IQRElementConfig);
    case ElementTypes.Text:
      return createTextElement(element as ITextElementConfig);
    default:
      throw new Error('Unknown tab tool');
  }
}

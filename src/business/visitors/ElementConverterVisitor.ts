import { ElementTypes } from '../../models/constants/designer';
import BackgroundColor from '../elements/BackgroundColor';
import BackgroundImage from '../elements/BackgroundImage';
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
  IElementConfig,
  IImageElementConfig,
  IQRElementConfig,
  IStickerElementConfig,
  ITextElementConfig,
} from '../interfaces/configsInterfaces';
import { IVisitor } from './visitorsInterfaces';

function ceil(num: number): number {
  return Math.ceil(num) || 0;
}

function round(num: number): number {
  return Math.round(num) || 0;
}

function trunc(num: number): number {
  return Math.trunc(num) || 0;
}

function toFixed2(num: number): number {
  return +num.toFixed(2) || 0;
}

function wrapText(text: string, fontSize: number, fontFamily: string): string {
  return `<span style="font-size: ${fontSize}pt; font-family: ${fontFamily}">${text}</span>`;
}

function refactorText(text: string): string {
  const replaceable = [
    {
      from: '<strong>',
      to: '<b>',
    },
    {
      from: '</strong>',
      to: '</b>',
    },
    {
      from: '<em>',
      to: '<i>',
    },
    {
      from: '</em>',
      to: '</i>',
    },
    {
      from: '<br/>',
      to: '<br>',
    },
    {
      from: '<br />',
      to: '<br>',
    },
  ];
  return replaceable.reduce((acc, item) => acc.replace(item.from, item.to), text);
}

export default class ElementConverterVisitor implements IVisitor<IElementConfig> {
  public visitBackgroundColor(element: BackgroundColor): IElementConfig {
    const config: IBackgroundColorElementConfig = {
      type: ElementTypes.BackgroundColor,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      width: round(element.width),
      height: round(element.height),
      color: element.color,
    };
    return config;
  }

  public visitBackgroundImage(element: BackgroundImage): IElementConfig {
    const config: IBackgroundImageElementConfig = {
      type: ElementTypes.BackgroundImage,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      source: element.source,
      url: element.url,
      mediumUrl: element.mediumUrl,
      thumbUrl: element.thumbUrl,
      width: round(element.width),
      height: round(element.height),
      originalWidth: element.originalWidth,
      originalHeight: element.originalHeight,
      verticalFlip: element.flip.vertical,
      horizontalFlip: element.flip.horizontal,
      crop: {
        left: round(element.crop.x - element.crop.width / 2),
        top: round(element.crop.y - element.crop.height / 2),
        width: round(element.crop.width),
        height: round(element.crop.height),
      },
      filters: element.filters,
    };
    return config;
  }

  public visitImage(element: Image): IElementConfig {
    const config: IImageElementConfig = {
      type: ElementTypes.Image,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      source: element.source,
      url: element.url,
      mediumUrl: element.mediumUrl,
      thumbUrl: element.thumbUrl,
      width: round(element.width),
      height: round(element.height),
      originalWidth: element.originalWidth,
      originalHeight: element.originalHeight,
      rotation: toFixed2(element.rotation),
      verticalFlip: element.flip.vertical,
      horizontalFlip: element.flip.horizontal,
      crop: {
        left: round(element.crop.x - element.crop.width / 2),
        top: round(element.crop.y - element.crop.height / 2),
        width: round(element.crop.width),
        height: round(element.crop.height),
      },
      placeholder: element.placeholder,
      filters: element.filters,
    };
    return config;
  }

  public visitSticker(element: Sticker): IElementConfig {
    const config: IStickerElementConfig = {
      type: ElementTypes.Clipart,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      source: element.source,
      url: element.url,
      mediumUrl: element.mediumUrl,
      thumbUrl: element.thumbUrl,
      width: round(element.width),
      height: round(element.height),
      originalWidth: element.originalWidth,
      originalHeight: element.originalHeight,
      rotation: toFixed2(element.rotation),
      verticalFlip: element.flip.vertical,
      horizontalFlip: element.flip.horizontal,
      color: element.color,
      crop: {
        left: round(element.crop.x - element.crop.width / 2),
        top: round(element.crop.y - element.crop.height / 2),
        width: round(element.crop.width),
        height: round(element.crop.height),
      },
    };
    return config;
  }

  public visitText(element: Text): IElementConfig {
    const config: ITextElementConfig = {
      type: ElementTypes.Text,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      width: ceil(element.width),
      height: ceil(element.height),
      text: wrapText(refactorText(element.text), trunc(element.fontSize), element.fontFamily),
      color: element.color,
      align: element.align,
      rotation: toFixed2(element.rotation),
      manuallyResized: element.manuallyResized,
      placeholder: element.placeholder,
      textType: element.textType,
    };
    return config;
  }

  public visitQREmail(element: QREmail): IElementConfig {
    return this.convertQR(element);
  }

  public visitQRMeCard(element: QRMeCard): IElementConfig {
    return this.convertQR(element);
  }

  public visitQRVCard(element: QRVCard): IElementConfig {
    return this.convertQR(element);
  }

  public visitQRPhone(element: QRPhone): IElementConfig {
    return this.convertQR(element);
  }

  public visitQRText(element: QRText): IElementConfig {
    return this.convertQR(element);
  }

  private convertQR(element: QR): IQRElementConfig {
    return {
      type: ElementTypes.QR,
      left: round(element.x - element.width / 2),
      top: round(element.y - element.height / 2),
      width: round(element.width),
      height: round(element.height),
      value: element.value,
      format: element.format,
      color: element.color,
      rotation: toFixed2(element.rotation),
    };
  }
}

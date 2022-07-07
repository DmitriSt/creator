import cloneDeep from 'lodash.clonedeep';

import consts from '../../models/constants/consts';
import { ElementTypes, TextTypes } from '../../models/constants/designer';
import { FormatTypes } from '../../models/designer/qr.models';
import { TabDragDropComponents } from '../../models/designer/tabBar.models';
import { getTextBounds } from '../../view/helpers/textHelpers';
import { between } from '../../view/helpers/utils';
import BackgroundColor from '../elements/BackgroundColor';
import BackgroundImage from '../elements/BackgroundImage';
import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import Image from '../elements/Image';
import QR from '../elements/QR';
import QREmail from '../elements/QREmail';
import QRMeCard from '../elements/QRMeCard';
import QRPhone from '../elements/QRPhone';
import QRText from '../elements/QRText';
import QRVCard from '../elements/QRVCard';
import Sticker from '../elements/Sticker';
import Text from '../elements/Text';
import * as Guard from '../Guard';
import { IWithColor, IWithFilters, IWithImage, IWithText } from '../interfaces/featuresInterfaces';
import { ICrop, IDimension, ILayoutElement, IPosition, IPreviewElement } from '../interfaces/interfaces';
import { extractTextProps } from './configToElementFactory';

function createQRElement(bounds: IDimension, position: IPosition, payload: FormatTypes): QR<unknown> {
  const size = Math.min(bounds.width, bounds.height) / consts.previews.PLACEMENT_SIZE_RATIO;
  const qrPosition: IPosition = {
    x: between(position.x, size / 2, bounds.width - size / 2),
    y: between(position.y, size / 2, bounds.height - size / 2),
  };
  switch (payload) {
    case FormatTypes.MeCard:
      return new QRMeCard(qrPosition.x, qrPosition.y, size, size, null, payload);
    case FormatTypes.VCard:
      return new QRVCard(qrPosition.x, qrPosition.y, size, size, null, payload);
    case FormatTypes.Phone:
      return new QRPhone(qrPosition.x, qrPosition.y, size, size, null, payload);
    case FormatTypes.Email:
      return new QREmail(qrPosition.x, qrPosition.y, size, size, null, payload);
    case FormatTypes.URL:
    case FormatTypes.Text:
      return new QRText(qrPosition.x, qrPosition.y, size, size, null, payload);
    default:
      throw new Error('Unsupported type of QR code');
  }
}

function createBackgroundImageElement(bounds: IDimension, payload: IWithImage & IWithFilters): BackgroundImage {
  const crop: ICrop = {
    x: payload.originalWidth / 2,
    y: payload.originalHeight / 2,
    width: payload.originalWidth,
    height: payload.originalHeight,
  };
  return new BackgroundImage(
    bounds.width / 2,
    bounds.height / 2,
    bounds.width,
    bounds.height,
    payload.originalWidth,
    payload.originalHeight,
    payload.source,
    payload.thumbUrl,
    payload.mediumUrl,
    payload.url,
    null,
    crop,
    payload.filters
  );
}

function getDimension(bounds: IDimension, originals: IWithImage): IDimension {
  const ratio = originals.originalWidth / originals.originalHeight;
  const width =
    bounds.height < bounds.width
      ? (bounds.height / consts.previews.PLACEMENT_SIZE_RATIO) * ratio
      : bounds.width / consts.previews.PLACEMENT_SIZE_RATIO;
  const height =
    bounds.height < bounds.width
      ? bounds.height / consts.previews.PLACEMENT_SIZE_RATIO
      : bounds.width / consts.previews.PLACEMENT_SIZE_RATIO / ratio;
  return {
    width: originals.originalWidth < width ? originals.originalWidth : width,
    height: originals.originalHeight < height ? originals.originalHeight : height,
  };
}

function createImageElement(bounds: IDimension, position: IPosition, payload: IWithImage & IWithFilters): Image {
  const dimension = getDimension(bounds, payload);
  const crop: ICrop = {
    x: payload.originalWidth / 2,
    y: payload.originalHeight / 2,
    width: payload.originalWidth,
    height: payload.originalHeight,
  };
  return new Image(
    position.x,
    position.y,
    dimension.width,
    dimension.height,
    payload.originalWidth,
    payload.originalHeight,
    payload.source,
    payload.thumbUrl,
    payload.mediumUrl,
    payload.url,
    0,
    null,
    crop,
    payload.filters
  );
}

function createStickerElement(bounds: IDimension, position: IPosition, payload: IWithImage): Sticker {
  const dimension = getDimension(bounds, payload);
  const crop: ICrop = {
    x: payload.originalWidth / 2,
    y: payload.originalHeight / 2,
    width: payload.originalWidth,
    height: payload.originalHeight,
  };
  return new Sticker(
    position.x,
    position.y,
    dimension.width,
    dimension.height,
    payload.originalWidth,
    payload.originalHeight,
    payload.source,
    payload.thumbUrl,
    payload.mediumUrl,
    payload.url,
    '',
    0,
    null,
    crop
  );
}

function createTextElement(bounds: IDimension, position: IPosition, payload: IWithText): Text {
  const { width, height } = getTextBounds(consts.designer.EMPTY_TEXT, payload.fontSize, payload.fontFamily);
  return new Text(
    position.x,
    position.y,
    width,
    height,
    consts.designer.EMPTY_TEXT,
    payload.placeholder,
    false,
    payload.color,
    payload.fontFamily,
    payload.fontSize,
    payload.align
  );
}

function createLayoutElements(payload: ILayoutElement): BaseElement[] {
  const canvas = designer.getCurrentCanvas();
  const buffer = cloneDeep(canvas.elements);

  const textElements = Guard.getElementsWithText(buffer).filter((textEl) => textEl.textType !== TextTypes.None);
  const newTextElements = payload.json.items.filter((item) => item.type === ElementTypes.Text);
  newTextElements.forEach((newTextElement) => {
    const replaceable = textElements.find((textElement) => textElement.textType === newTextElement.textType) as Text;
    const textProps = extractTextProps(newTextElement.text);
    const newElement = new Text(
      newTextElement.left + newTextElement.width / 2,
      newTextElement.top + newTextElement.height / 2,
      newTextElement.width,
      newTextElement.height,
      replaceable ? replaceable.text : textProps.text,
      newTextElement.placeholder,
      newTextElement.manuallyResized,
      textProps.color,
      textProps.fontFamily,
      textProps.fontSize,
      newTextElement.align,
      newTextElement.rotation,
      newTextElement.textType
    );
    if (replaceable) {
      const index = buffer.indexOf(replaceable);
      buffer.splice(index, 1, newElement);
    } else {
      buffer.push(newElement);
    }
  });
  return buffer;
}

function createBackgroundColorElement(bounds: IDimension, payload: IWithColor): BackgroundColor {
  return new BackgroundColor(bounds.width / 2, bounds.height / 2, bounds.width, bounds.height, payload.color);
}

export default function createCanvasElements<T extends unknown>(preview: IPreviewElement<T>): BaseElement[] {
  const zoom = preview.zoom || 1;

  const canvas = document.getElementById('canvas-main');
  if (!canvas) throw new Error('Canvas instance not found');
  const bounds = canvas.getBoundingClientRect();
  const scaledBounds: IDimension = {
    width: Math.round(bounds.width / zoom / preview.position.coefficient),
    height: Math.round(bounds.height / zoom / preview.position.coefficient),
  };
  const zone = preview.bgReplace ? consts.designer.BACKGROUND_DROP_ZONE_PADDING : 0;
  const position: IPosition = {
    x: (preview.position.x - bounds.x) / zoom / preview.position.coefficient,
    y: (preview.position.y - bounds.y) / zoom / preview.position.coefficient,
  };
  if (
    position.x < 0 - zone ||
    position.y < 0 - zone ||
    position.x > scaledBounds.width + zone ||
    position.y > scaledBounds.height + zone
  ) {
    return null;
  }
  switch (preview.type) {
    case TabDragDropComponents.QR:
      return [createQRElement(scaledBounds, position, preview.payload as FormatTypes)];
    case TabDragDropComponents.Background:
      return [createBackgroundImageElement(scaledBounds, preview.payload as IWithImage & IWithFilters)];
    case TabDragDropComponents.Color:
      return [createBackgroundColorElement(scaledBounds, preview.payload as IWithColor)];
    case TabDragDropComponents.Image:
      return [createImageElement(scaledBounds, position, preview.payload as IWithImage & IWithFilters)];
    case TabDragDropComponents.Sticker:
      return [createStickerElement(scaledBounds, position, preview.payload as IWithImage)];
    case TabDragDropComponents.Text:
      return [createTextElement(scaledBounds, position, preview.payload as IWithText)];
    case TabDragDropComponents.Layout:
      return createLayoutElements(preview.payload as ILayoutElement);

    default:
      throw new Error('Unknown tab tool');
  }
}

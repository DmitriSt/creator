import cloneDeep from 'lodash.clonedeep';

import { between, rotateByAxes, toRadian } from '../../view/helpers/utils';
import BaseElement from '../elements/BaseElement';
import * as Guard from '../Guard';
import { ICroppable, IWithImage } from '../interfaces/featuresInterfaces';
import { ICrop, IDimension, IPosition, IVector } from '../interfaces/interfaces';

export default class CropManager {
  static zoom(element: BaseElement & IWithImage & ICroppable, scale: number): BaseElement & IWithImage & ICroppable {
    const elementWithImage = Guard.getElementsWithImage([element])[0];
    if (!elementWithImage) return element;
    const buffer = cloneDeep(elementWithImage);

    if (scale === 1) {
      buffer.crop.width = element.originalWidth;
      buffer.crop.height = element.originalHeight;
      return buffer;
    }

    const cropRatio = element.crop.height / element.crop.width;
    const refByWidth: IDimension = {
      width: element.originalWidth,
      height: element.originalWidth * cropRatio,
    };
    const refByHeight: IDimension = {
      width: element.originalHeight / cropRatio,
      height: element.originalHeight,
    };
    const ref = element.crop.width > element.crop.height ? refByWidth : refByHeight;
    buffer.crop.width = ref.width * scale;
    buffer.crop.height = ref.height * scale;
    if (buffer.crop.x < buffer.crop.width / 2) {
      buffer.crop.x = buffer.crop.width / 2;
    }
    if (buffer.crop.x > buffer.originalWidth - buffer.crop.width / 2) {
      buffer.crop.x = buffer.originalWidth - buffer.crop.width / 2;
    }
    if (buffer.crop.y < buffer.crop.height / 2) {
      buffer.crop.y = buffer.crop.height / 2;
    }
    if (buffer.crop.y > buffer.originalHeight - buffer.crop.height / 2) {
      buffer.crop.y = buffer.originalHeight - buffer.crop.height / 2;
    }
    return buffer;
  }

  static move(element: BaseElement & ICroppable, delta: IVector): BaseElement & ICroppable {
    const elementWithImage = Guard.getElementsWithImage([element])[0];
    if (!elementWithImage) return element;
    const buffer = cloneDeep(elementWithImage);
    const wRatio = buffer.crop.width / buffer.width;
    const hRatio = buffer.crop.height / buffer.height;
    const ratio = Math.min(wRatio, hRatio);
    const flippable = Guard.getFlippables([buffer])[0];
    const newX = buffer.crop.x - delta.x * ratio * (flippable?.flip.horizontal ? -1 : 1);
    const newY = buffer.crop.y - delta.y * ratio * (flippable?.flip.vertical ? -1 : 1);
    buffer.crop.x = between(newX, 0, buffer.originalWidth);
    buffer.crop.y = between(newY, 0, buffer.originalHeight);
    return buffer;
  }

  static checkCropMove(element: BaseElement, placeholder: ICrop, originDelta: IVector): IPosition {
    const rotatable = Guard.getRotatables([element])[0];
    const rad = rotatable ? toRadian(rotatable.rotation) : 0;

    const delta = rotateByAxes(originDelta, -rad);

    const cropLeft = placeholder.x - element.width / 2;
    const cropTop = placeholder.y - element.height / 2;

    const cropRight = placeholder.x + element.width / 2;
    const cropBottom = placeholder.y + element.height / 2;

    const resultDelta = {
      x: between(delta.x, cropRight - placeholder.width, cropLeft),
      y: between(delta.y, cropBottom - placeholder.height, cropTop),
    };

    const convertedDelta = rotateByAxes(resultDelta, rad);

    return {
      x: element.x + convertedDelta.x,
      y: element.y + convertedDelta.y,
    };
  }
}

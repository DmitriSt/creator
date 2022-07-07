import cloneDeep from 'lodash.clonedeep';

import consts from '../../models/constants/consts';
import { Aligns, TextAligns } from '../../models/constants/designer';
import { BorderDimensions } from '../../models/designer/designer.models';
import { getTextBounds } from '../../view/helpers/textHelpers';
import { between, rotateByAxes, toRadian } from '../../view/helpers/utils';
import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import Image from '../elements/Image';
import Text from '../elements/Text';
import * as Guard from '../Guard';
import { IDimension, IVector } from '../interfaces/interfaces';

const cornerAligns = [Aligns.LeftBottom, Aligns.LeftTop, Aligns.RightBottom, Aligns.RightTop];

function distanceToNearestBorder(element: Text): number {
  const currentCanvasWidth = designer.getCurrentCanvas().width;
  const leftPoint = element.x - element.width / 2;
  const rightPoint = element.x + element.width / 2;
  if (leftPoint >= 0 && rightPoint <= currentCanvasWidth) {
    switch (element.align) {
      case Aligns.Left:
        return element.width / 2 + currentCanvasWidth - element.x;
      case Aligns.Center:
        return 2 * Math.min(element.x, currentCanvasWidth - element.x);
      case Aligns.Right:
        return element.width / 2 + element.x;
      default:
        throw new Error('Unknown align type');
    }
  }
  return currentCanvasWidth;
}

function getTextShift(delta: number, align: TextAligns): number {
  switch (align) {
    case Aligns.Left:
      return delta / 2;
    case Aligns.Right:
      return -delta / 2;
    default:
      return 0;
  }
}

function proportionally(
  ref: BaseElement,
  element: BaseElement,
  shiftX: number,
  shiftY: number,
  limits: BorderDimensions
): IDimension {
  const minWidth = limits?.minWidth || element.minWidth;
  const maxWidth = limits?.maxWidth || element.maxWidth;
  const minHeight = limits?.minHeight || element.minHeight;
  const maxHeight = limits?.maxHeight || element.maxHeight;
  const dimensions: IDimension = {
    width: element.width,
    height: element.height,
  };
  if (minWidth >= minHeight || maxWidth <= maxHeight) {
    const ratio = ref.height / ref.width;
    const minWidthMax = Math.max(minWidth, minHeight / ratio);
    const maxWidthMin = Math.min(maxWidth, maxHeight / ratio);
    dimensions.width += shiftX;
    dimensions.height = dimensions.width * ratio;
    if (dimensions.width < minWidthMax) {
      dimensions.width = minWidthMax;
      dimensions.height = minWidthMax * ratio;
    }
    if (dimensions.width > maxWidthMin) {
      dimensions.width = maxWidthMin;
      dimensions.height = maxWidthMin * ratio;
    }
  } else {
    const ratio = ref.width / ref.height;
    const minHeightMax = Math.max(minHeight, minWidth / ratio);
    const maxHeightMin = Math.min(maxHeight, maxWidth / ratio);
    dimensions.height += shiftY;
    dimensions.width = dimensions.height * ratio;
    if (dimensions.height < minHeightMax) {
      dimensions.height = minHeightMax;
      dimensions.width = minHeightMax * ratio;
    }
    if (dimensions.height > maxHeightMin) {
      dimensions.height = maxHeightMin;
      dimensions.width = maxHeightMin * ratio;
    }
  }
  return dimensions;
}

function getCropLeftPadding(element: Image, x?: number): number {
  return between((x || element.crop.x) - element.crop.width / 2, 0, element.originalWidth);
}

function getCropRightPadding(element: Image, x?: number): number {
  return between(element.originalWidth - (x || element.crop.x) - element.crop.width / 2, 0, element.originalWidth);
}

function getCropTopPadding(element: Image, y?: number): number {
  return between((y || element.crop.y) - element.crop.height / 2, 0, element.originalHeight);
}

function getCropBottomPadding(element: Image, y?: number): number {
  return between(element.originalHeight - (y || element.crop.y) - element.crop.height / 2, 0, element.originalHeight);
}

function withinWidth(element: Image, value: number): number {
  return between(value, 0, element.originalWidth);
}

function withinHeight(element: Image, value: number): number {
  return between(value, 0, element.originalHeight);
}

export default class ResizeManager {
  static resize(element: BaseElement, originDelta: IVector, align?: Aligns, limits?: BorderDimensions): BaseElement {
    const minWidth = limits?.minWidth || element.minWidth;
    const maxWidth = limits?.maxWidth || element.maxWidth;
    const minHeight = limits?.minHeight || element.minHeight;
    const maxHeight = limits?.maxHeight || element.maxHeight;

    const rad = toRadian(Guard.getRotatables([element])[0]?.rotation || 0);

    const delta = rotateByAxes(originDelta, -rad);
    const buffer = cloneDeep(element);

    const resultDelta: IVector = {
      x: 0,
      y: 0,
    };

    if (align === Aligns.Top || align === Aligns.Bottom) {
      resultDelta.y = delta.y;
    } else if (align === Aligns.Left || align === Aligns.Right) {
      resultDelta.x = delta.x;
    } else {
      const ratio = element.width / element.height;
      resultDelta.x = delta.x;
      resultDelta.y = delta.x / ratio;
      if (align === Aligns.RightTop || align === Aligns.LeftBottom) {
        resultDelta.y = -resultDelta.y;
      }
    }

    const shift: IVector = { ...resultDelta };
    let dimensions: IDimension = {
      width: buffer.width,
      height: buffer.height,
    };

    switch (align) {
      case Aligns.Top:
        dimensions.height -= resultDelta.y;
        shift.y = between(shift.y, element.height - maxHeight, element.height - minHeight) / 2;
        break;
      case Aligns.Bottom:
        dimensions.height += resultDelta.y;
        shift.y = between(shift.y, minHeight - element.height, maxHeight - element.height) / 2;
        break;
      case Aligns.Left:
        dimensions.width -= resultDelta.x;
        shift.x = between(shift.x, element.width - maxWidth, element.width - minWidth) / 2;
        break;
      case Aligns.Right:
        dimensions.width += resultDelta.x;
        shift.x = between(shift.x, minWidth - element.width, maxWidth - element.width) / 2;
        break;
      case Aligns.LeftTop:
        dimensions = proportionally(element, buffer, -resultDelta.x, -resultDelta.y, limits);
        shift.x = between(shift.x, element.width - dimensions.width, element.width - dimensions.width) / 2;
        shift.y = between(shift.y, element.height - dimensions.height, element.height - dimensions.height) / 2;
        break;
      case Aligns.RightTop:
        dimensions = proportionally(element, buffer, resultDelta.x, -resultDelta.y, limits);
        shift.x = between(shift.x, dimensions.width - element.width, dimensions.width - element.width) / 2;
        shift.y = between(shift.y, element.height - dimensions.height, element.height - dimensions.height) / 2;
        break;
      case Aligns.RightBottom:
        dimensions = proportionally(element, buffer, resultDelta.x, resultDelta.y, limits);
        shift.x = between(shift.x, dimensions.width - element.width, dimensions.width - element.width) / 2;
        shift.y = between(shift.y, dimensions.height - element.height, dimensions.height - element.height) / 2;
        break;
      case Aligns.LeftBottom:
        dimensions = proportionally(element, buffer, -resultDelta.x, resultDelta.y, limits);
        shift.x = between(shift.x, element.width - dimensions.width, element.width - dimensions.width) / 2;
        shift.y = between(shift.y, dimensions.height - element.height, dimensions.height - element.height) / 2;
        break;
      default:
        throw new Error(`Unknown align: ${align}`);
    }

    const convertedDelta = rotateByAxes(shift, rad);

    buffer.x += convertedDelta.x;
    buffer.y += convertedDelta.y;
    buffer.width = between(dimensions.width, minWidth, maxWidth);
    buffer.height = between(dimensions.height, minHeight, maxHeight);

    return buffer;
  }

  static resizeText(
    element: BaseElement,
    originDelta: IVector,
    align: Aligns,
    text: string,
    fontSize: number,
    fontFamily?: string
  ): Text {
    const buffer = cloneDeep(element) as Text;

    if (cornerAligns.includes(align)) {
      const resized = (originDelta && align ? ResizeManager.resize(element, originDelta, align) : buffer) as Text;
      const rad = toRadian(Guard.getRotatables([element])[0]?.rotation || 0);
      const scale = resized.width / element.width;
      resized.fontSize = between(Math.trunc(fontSize * scale), consts.designer.MINIMAL_FONT_SIZE, Infinity);
      const growScale = resized.fontSize / (element as Text).fontSize;
      const limit = element.width * growScale;
      const newTextBounds = getTextBounds(text, resized.fontSize, fontFamily, limit);
      resized.width = limit;
      resized.height = newTextBounds.height;
      resized.manuallyResized = resized.manuallyResized || element.width !== resized.width;
      let shift: IVector;
      switch (align) {
        case Aligns.LeftTop:
          shift = rotateByAxes(
            {
              x: element.width / 2 - resized.width / 2,
              y: element.height / 2 - resized.height / 2,
            },
            rad
          );
          break;
        case Aligns.RightTop:
          shift = rotateByAxes(
            {
              x: resized.width / 2 - element.width / 2,
              y: element.height / 2 - resized.height / 2,
            },
            rad
          );
          break;
        case Aligns.RightBottom:
          shift = rotateByAxes(
            {
              x: resized.width / 2 - element.width / 2,
              y: resized.height / 2 - element.height / 2,
            },
            rad
          );
          break;
        case Aligns.LeftBottom:
          shift = rotateByAxes(
            {
              x: element.width / 2 - resized.width / 2,
              y: resized.height / 2 - element.height / 2,
            },
            rad
          );
          break;
        default:
          throw new Error(`Unknown align: ${align}`);
      }
      resized.x = element.x + shift.x;
      resized.y = element.y + shift.y;
      return resized;
    }

    const resized = (originDelta && align
      ? ResizeManager.resize(buffer, originDelta, align, { minWidth: consts.designer.MINIMAL_TEXT_ELEMENT_WIDTH })
      : buffer) as Text;
    resized.manuallyResized = resized.manuallyResized || element.width !== resized.width;
    const rad = toRadian(Guard.getRotatables([element])[0]?.rotation || 0);
    const { width, height } = getTextBounds(
      text,
      fontSize,
      fontFamily,
      resized.manuallyResized ? resized.width : distanceToNearestBorder(resized)
    );
    const shift: IVector = {
      x: 0,
      y: (height - resized.height) / 2,
    };
    const rotated = rotateByAxes(shift, rad);
    if (!resized.manuallyResized) resized.width = width;
    resized.height = height;
    resized.x += resized.manuallyResized ? rotated.x : getTextShift(resized.width - element.width, resized.align);
    resized.y += rotated.y;
    return resized;
  }

  static resizeImage(element: Image, originDelta: IVector, align: Aligns): Image {
    const buffer = cloneDeep(ResizeManager.resize(element, originDelta, align)) as Image;

    const rotation = Guard.getRotatables([element])[0]?.rotation || 0;

    const delta = rotateByAxes(originDelta, -toRadian(rotation));

    if (align === Aligns.Left || align === Aligns.Right) {
      const isLeft = align === Aligns.Left;
      const isRight = align === Aligns.Right;

      const direction = isLeft ? -1 : 1;

      if (buffer.width <= buffer.minWidth || buffer.width >= buffer.maxWidth) {
        delta.x = (element.minWidth - element.width) * direction;
      }

      const canvasToOriginalWidthRatio = (element.crop.width / element.width) * direction;

      if (buffer.width < element.width) {
        buffer.crop.width = between(
          buffer.crop.width + delta.x * canvasToOriginalWidthRatio,
          buffer.minWidth * canvasToOriginalWidthRatio,
          buffer.originalWidth
        );
        return buffer;
      }

      const elementLeftPadding = getCropLeftPadding(element);
      const elementRightPadding = getCropRightPadding(element);

      if (elementLeftPadding === 0 && elementRightPadding === 0) {
        buffer.crop.height = (element.originalWidth * buffer.height) / buffer.width;
        return buffer;
      }

      const isBorderedSide = (isLeft && elementLeftPadding === 0) || (isRight && elementRightPadding === 0);
      const borderedSideRatio = isBorderedSide ? -1 : 1;

      const shift = (delta.x / 2) * canvasToOriginalWidthRatio * direction * borderedSideRatio;
      buffer.crop.x = withinWidth(buffer, buffer.crop.x + shift);
      buffer.crop.width = withinWidth(buffer, buffer.crop.width + delta.x * canvasToOriginalWidthRatio);
      const leftFloatPadding = getCropLeftPadding(buffer);
      const rightFloatPadding = getCropRightPadding(buffer);
      if (((isLeft && !isBorderedSide) || (isRight && isBorderedSide) ? leftFloatPadding : rightFloatPadding) <= 0) {
        const leftPadding = getCropLeftPadding(buffer, buffer.originalWidth / 2);
        const rightPadding = getCropRightPadding(buffer, buffer.originalWidth / 2);
        const padding = isLeft ? rightPadding : leftPadding;
        buffer.crop.x = withinWidth(buffer, buffer.originalWidth / 2 + padding * direction * borderedSideRatio);
        if (leftPadding === 0 && rightPadding === 0) {
          buffer.crop.height = (element.originalWidth * buffer.height) / buffer.width;
        }
      }
    } else if (align === Aligns.Top || align === Aligns.Bottom) {
      const isTop = align === Aligns.Top;
      const isBottom = align === Aligns.Bottom;

      const direction = isTop ? -1 : 1;

      if (buffer.height <= buffer.minHeight || buffer.height >= buffer.maxHeight) {
        delta.y = (element.minHeight - element.height) * direction;
      }

      const canvasToOriginalHeightRatio = (element.crop.height / element.height) * direction;

      if (buffer.height < element.height) {
        buffer.crop.height = between(
          buffer.crop.height + delta.y * canvasToOriginalHeightRatio,
          buffer.minHeight * canvasToOriginalHeightRatio,
          buffer.originalHeight
        );
        return buffer;
      }

      const elementTopPadding = getCropTopPadding(element);
      const elementBottomPadding = getCropBottomPadding(element);

      if (elementTopPadding === 0 && elementBottomPadding === 0) {
        buffer.crop.width = (element.originalHeight * buffer.width) / buffer.height;
        return buffer;
      }

      const isBorderedSide = (isTop && elementTopPadding === 0) || (isBottom && elementBottomPadding === 0);
      const borderedSideRatio = isBorderedSide ? -1 : 1;

      const shift = (delta.y / 2) * canvasToOriginalHeightRatio * direction * borderedSideRatio;
      buffer.crop.y = withinHeight(buffer, buffer.crop.y + shift);
      buffer.crop.height = withinHeight(buffer, buffer.crop.height + delta.y * canvasToOriginalHeightRatio);
      const topFloatPadding = getCropTopPadding(buffer);
      const bottomFloatPadding = getCropBottomPadding(buffer);
      if (((isTop && !isBorderedSide) || (isBottom && isBorderedSide) ? topFloatPadding : bottomFloatPadding) <= 0) {
        const topPadding = getCropTopPadding(buffer, buffer.originalHeight / 2);
        const bottomPadding = getCropBottomPadding(buffer, buffer.originalHeight / 2);
        const padding = isTop ? bottomPadding : topPadding;
        buffer.crop.y = withinHeight(buffer, buffer.originalHeight / 2 + padding * direction * borderedSideRatio);
        if (topPadding === 0 && bottomPadding === 0) {
          buffer.crop.width = (element.originalHeight * buffer.width) / buffer.height;
        }
      }
    }

    return buffer;
  }
}

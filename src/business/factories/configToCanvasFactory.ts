import { ElementTypes } from '../../models/constants/designer';
import Canvas from '../elements/Canvas';
import { ICanvasConfig, IElementConfig } from '../interfaces/configsInterfaces';
import { IDimension } from '../interfaces/interfaces';
import createCanvasElement from './configToElementFactory';

export default function createCanvas(canvas: ICanvasConfig): Canvas {
  const dimension: IDimension = {
    width: canvas.width,
    height: canvas.height,
  };
  if (!canvas.items.length) {
    const element: IElementConfig = {
      type: ElementTypes.BackgroundColor,
      top: 0,
      left: 0,
      width: canvas.width,
      height: canvas.height,
    };
    canvas.items.push(element);
  }
  const elements = canvas.items.map((element) => createCanvasElement(element, dimension));
  return new Canvas(
    dimension.width,
    dimension.height,
    canvas.name,
    elements,
    canvas.id,
    canvas.layoutId,
    canvas.left,
    canvas.top,
    canvas.bleed,
    canvas.disabled
  );
}

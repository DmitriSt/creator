import designer from '../elements/Designer';
import Text from '../elements/Text';
import { IWithTextSize } from '../interfaces/featuresInterfaces';
import { IElement } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class ResizeTextCommand extends BaseCommand {
  public readonly name = 'Resize text element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prev: IElement & IWithTextSize;
  private readonly _next: IElement & IWithTextSize;

  public constructor(prev: IElement & IWithTextSize, next: IElement & IWithTextSize, elementId: string) {
    super();
    this._prev = { ...prev };
    this._next = { ...next };
    this._elementId = elementId;
    this._page = designer.activePage;

    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layer = designer.pages[this._page].canvases[i].elements.findIndex(
        (element) => element.id === this._elementId
      );
      if (layer !== -1) {
        this._canvas = i;
        this._layer = layer;
        break;
      }
    }
    if (this._layer === undefined) {
      throw new Error('Element not found');
    }
  }

  public do(): Promise<void> {
    this._change(this._next);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prev);
    return Promise.resolve();
  }

  private _change(value: IElement & IWithTextSize) {
    const textElement = designer.pages[this._page].canvases[this._canvas].elements[this._layer] as Text;
    textElement.x = value.x;
    textElement.y = value.y;
    textElement.width = value.width;
    textElement.height = value.height;
    textElement.fontSize = value.fontSize;

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}

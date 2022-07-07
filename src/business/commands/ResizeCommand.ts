import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import { IElement } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class ResizeCommand extends BaseCommand {
  public readonly name = 'Resize element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevBounds: IElement;
  private readonly _nextBounds: IElement;

  public constructor(prevBounds: IElement, nextBounds: IElement, elementId: string) {
    super();
    this._prevBounds = { ...prevBounds };
    this._nextBounds = { ...nextBounds };
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
    this._change(this._nextBounds);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevBounds);
    return Promise.resolve();
  }

  private _change(bounds: IElement) {
    const element = designer.pages[this._page].canvases[this._canvas].elements[this._layer];
    (element as BaseElement).bounds = {
      ...bounds,
    };

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}

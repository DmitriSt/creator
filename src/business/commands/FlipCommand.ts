import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import { IFlippable } from '../interfaces/featuresInterfaces';
import { IFlip } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class FlipCommand extends BaseCommand {
  public readonly name = 'Flip element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevFlip: IFlip;
  private readonly _nextFlip: IFlip;

  public constructor(prev: IFlip, next: IFlip, elementId: string) {
    super();
    this._prevFlip = { ...prev };
    this._nextFlip = { ...next };
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
    this._change(this._nextFlip);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevFlip);
    return Promise.resolve();
  }

  private _change(flip: IFlip) {
    (designer.pages[this._page].canvases[this._canvas].elements[this._layer] as BaseElement & IFlippable).flip = {
      ...flip,
    };
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}

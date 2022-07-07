import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import { ICroppable } from '../interfaces/featuresInterfaces';
import { ICrop } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class CropCommand extends BaseCommand {
  public readonly name = 'Crop element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevCrop: ICrop;
  private readonly _nextCrop: ICrop;

  public constructor(prev: ICrop, next: ICrop, elementId: string) {
    super();
    this._prevCrop = { ...prev };
    this._nextCrop = { ...next };
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
    this._change(this._nextCrop);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevCrop);
    return Promise.resolve();
  }

  private _change(crop: ICrop) {
    (designer.pages[this._page].canvases[this._canvas].elements[this._layer] as BaseElement & ICroppable).crop = {
      ...crop,
    };
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}

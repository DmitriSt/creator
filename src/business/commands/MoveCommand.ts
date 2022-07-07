import designer from '../elements/Designer';
import { IPosition } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class MoveCommand extends BaseCommand {
  public readonly name = 'Move element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevPosition: IPosition;
  private readonly _nextPosition: IPosition;

  public constructor(prev: IPosition, next: IPosition, elementId: string) {
    super();
    this._prevPosition = { ...prev };
    this._nextPosition = { ...next };
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
    this._change(this._nextPosition);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevPosition);
    return Promise.resolve();
  }

  private _change(position: IPosition) {
    const element = designer.pages[this._page].canvases[this._canvas].elements[this._layer];
    element.x = position.x;
    element.y = position.y;

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}

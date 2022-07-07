import designer from '../elements/Designer';
import QR from '../elements/QR';
import BaseCommand from './BaseCommand';

export default class UpdateQRCommand<T = unknown> extends BaseCommand {
  public readonly name = 'Update QR value';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevValue: T;
  private readonly _nextValue: T;
  private readonly _isNotSelect: boolean;

  public constructor(prev: T, next: T, elementId: string, isNotSelect = false) {
    super();
    this._prevValue = { ...prev };
    this._nextValue = { ...next };
    this._elementId = elementId;
    this._isNotSelect = isNotSelect;
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
    this._change(this._nextValue, this._isNotSelect);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevValue);
    return Promise.resolve();
  }

  private _change(value: T, isNotSelect?: boolean) {
    (designer.pages[this._page].canvases[this._canvas].elements[this._layer] as QR).value = { ...value };

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    if (isNotSelect) return;
    designer.setSelectedElements([this._elementId]);
  }
}

import { TextAligns } from '../../models/constants/designer';
import designer from '../elements/Designer';
import Text from '../elements/Text';
import BaseCommand from './BaseCommand';

export default class UpdateTextAlignCommand extends BaseCommand {
  public readonly name = 'Change text align';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevValue: TextAligns;
  private readonly _nextValue: TextAligns;

  public constructor(prev: TextAligns, next: TextAligns, elementId: string) {
    super();
    this._prevValue = prev;
    this._nextValue = next;
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
    this._change(this._nextValue);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevValue);
    return Promise.resolve();
  }

  private _change(align: TextAligns) {
    (designer.pages[this._page].canvases[this._canvas].elements[this._layer] as Text).align = align;

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._elementId]);
  }
}

import designer from '../elements/Designer';
import Text from '../elements/Text';
import { IWithTextFamily } from '../interfaces/featuresInterfaces';
import { IElement } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class UpdateTextFamilyCommand extends BaseCommand {
  public readonly name = 'Change text family';

  private readonly _elementId: string;
  private readonly _oldText: string;
  private readonly _newText: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevValue: IElement & IWithTextFamily;
  private readonly _nextValue: IElement & IWithTextFamily;

  public constructor(
    prev: IElement & IWithTextFamily,
    next: IElement & IWithTextFamily,
    elementId: string,
    oldText: string,
    newText: string
  ) {
    super();
    this._prevValue = { ...prev };
    this._nextValue = { ...next };
    this._elementId = elementId;
    this._oldText = oldText;
    this._newText = newText;
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
    this._change(this._nextValue, this._newText);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prevValue, this._oldText);
    return Promise.resolve();
  }

  private _change(value: IElement & IWithTextFamily, text: string) {
    const textElement = designer.pages[this._page].canvases[this._canvas].elements[this._layer] as Text;
    textElement.x = value.x;
    textElement.y = value.y;
    textElement.width = value.width;
    textElement.text = text;
    textElement.height = value.height;
    textElement.fontFamily = value.fontFamily;

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._elementId]);
  }
}

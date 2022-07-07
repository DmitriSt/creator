import designer from '../elements/Designer';
import Text from '../elements/Text';
import { IWithPlaceholder, IWithTextValue } from '../interfaces/featuresInterfaces';
import { IElement } from '../interfaces/interfaces';
import BaseCommand from './BaseCommand';

export default class UpdateTextValueCommand extends BaseCommand {
  public name = 'Change text value';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevValue: IElement & IWithTextValue & IWithPlaceholder;
  private readonly _nextValue: IElement & IWithTextValue & IWithPlaceholder;

  public constructor(
    prev: IElement & IWithTextValue & IWithPlaceholder,
    next: IElement & IWithTextValue & IWithPlaceholder,
    elementId: string
  ) {
    super();
    this._prevValue = { ...prev };
    this._nextValue = { ...next };
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

  private _change(value: IElement & IWithTextValue & IWithPlaceholder) {
    const textElement = designer.pages[this._page].canvases[this._canvas].elements[this._layer] as Text;
    textElement.x = value.x;
    textElement.y = value.y;
    textElement.width = value.width;
    textElement.height = value.height;
    textElement.text = value.text;
    textElement.placeholder = value.placeholder;

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._elementId]);
  }
}

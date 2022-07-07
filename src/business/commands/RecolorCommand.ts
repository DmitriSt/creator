import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import Text from '../elements/Text';
import { IWithColor } from '../interfaces/featuresInterfaces';
import BaseCommand from './BaseCommand';

export default class RecolorCommand extends BaseCommand {
  public readonly name = 'Change color';

  private readonly _elementId: string;
  private readonly _oldText: string | null = null;
  private readonly _newText: string | null = null;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prevValue: string;
  private readonly _nextValue: string;

  public constructor(prev: string, next: string, elementId: string) {
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
        const element = designer.pages[this._page].canvases[i].elements[layer];
        if (element.elementName === 'Text') {
          const textElement = element as Text;
          this._oldText = textElement.text;
          const div = document.createElement('div');
          div.innerHTML = this._oldText;
          const list = div.querySelectorAll('font[color]');
          list.forEach((fontElement) => {
            fontElement.removeAttribute('color');
          });
          this._newText = div.innerHTML;
        }
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

  private _change(color: string, text: string | null) {
    const element = designer.pages[this._page].canvases[this._canvas].elements[this._layer] as BaseElement & IWithColor;
    element.color = color;
    if (text && element.elementName === 'Text') {
      const textElement = element as Text;
      textElement.text = text;
    }
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._elementId]);
  }
}

import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class ChangeLayersCommand extends BaseCommand {
  public readonly name = 'Change layers';

  private readonly _canvas: BaseElement[];
  private readonly _changePosEl: BaseElement;
  private readonly _replacedEl: BaseElement;
  private readonly _page: number;
  private readonly _activeCanvas: number;

  public constructor(canvas: BaseElement[], changePosEl: BaseElement, replacedEl: BaseElement) {
    super();
    this._canvas = canvas;
    this._changePosEl = changePosEl;
    this._replacedEl = replacedEl;
    this._page = designer.activePage;
    this._activeCanvas = designer.activeCanvas;
  }

  public do(): Promise<void> {
    this._replace(this._canvas, this._changePosEl, this._replacedEl);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._canvas, this._replacedEl, this._changePosEl);
    return Promise.resolve();
  }

  private _replace(canvas: BaseElement[], changePosEl: BaseElement, replacedEl: BaseElement) {
    let newCanv: BaseElement[] = [];
    for (let i = 0; i < canvas.length; i++) {
      if (canvas[i].id === replacedEl.id) {
        newCanv = canvas.filter((element) => element.id !== changePosEl.id);
        newCanv.splice(i, 0, changePosEl);
        break;
      }
    }
    designer.pages[this._page].canvases[this._activeCanvas].elements = newCanv;
    designer.activePage = this._page;
    designer.activeCanvas = this._activeCanvas;
  }
}

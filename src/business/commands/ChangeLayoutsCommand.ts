import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class ChangeLayoutsCommand extends BaseCommand {
  public readonly name = 'Change layout';

  private readonly _oldCanvas: BaseElement[];
  private readonly _newCanvas: BaseElement[];
  private readonly _page: number;
  private readonly _canvas: number;

  public constructor(oldCanvas: BaseElement[], newCanvas: BaseElement[]) {
    super();
    this._oldCanvas = oldCanvas;
    this._newCanvas = newCanvas;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;
  }

  public do(): Promise<void> {
    this._replace(this._newCanvas);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._oldCanvas);
    return Promise.resolve();
  }

  private _replace(canvas: BaseElement[]) {
    designer.pages[this._page].canvases[this._canvas].elements = canvas;
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.clearSelectedElements();
  }
}

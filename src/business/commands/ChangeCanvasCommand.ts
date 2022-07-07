import Canvas from '../elements/Canvas';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class ChangeCanvasCommand extends BaseCommand {
  public readonly name = 'Change canvas';

  private readonly _buffer: Canvas;
  private readonly _page: number;
  private readonly _canvas: Canvas;
  private readonly _index: number;

  public constructor(canvas: Canvas) {
    super();
    this._page = designer.activePage;
    this._canvas = canvas;
    this._buffer = designer.getCurrentCanvas();
    this._index = designer.activeCanvas;
  }

  public do(): Promise<void> {
    designer.pages[this._page].canvases[this._index] = this._canvas;
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    designer.pages[this._page].canvases[this._index] = this._buffer;
    return Promise.resolve();
  }
}

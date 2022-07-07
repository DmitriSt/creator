import cloneDeep from 'lodash.clonedeep';

import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class ToggleCanvasAvailability extends BaseCommand {
  public readonly name = 'Toggle Availability';

  private readonly _oldElements: BaseElement[];
  private readonly _newElements: BaseElement[];
  private readonly _canvasId: number;
  private readonly _canvasName: string;
  private readonly _disabled: boolean;

  public constructor(
    canvasId: number,
    canvasName: string,
    disabled: boolean,
    oldElements: BaseElement[],
    newElements?: BaseElement[]
  ) {
    super();
    this._oldElements = oldElements;
    this._newElements = newElements;
    this._canvasId = canvasId;
    this._canvasName = canvasName;
    this._disabled = disabled;
  }

  public do(): Promise<void> {
    this._replace(this._newElements, this._disabled);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._oldElements, !this._disabled);
    return Promise.resolve();
  }

  private _replace(elements: BaseElement[], disabled: boolean) {
    const canvases = designer.getAllCanvases();
    const canvas = canvases.find((canvas) => canvas.canvasId === this._canvasId && canvas.name === this._canvasName);
    canvas.elements = cloneDeep(elements);
    canvas.disabled = disabled;
    const activeCanvas = designer.pages[designer.activePage].canvases[designer.activeCanvas];
    if (this._canvasId === activeCanvas.canvasId) {
      designer.activePage = 0;
      designer.activeCanvas = 0;
    }
  }
}

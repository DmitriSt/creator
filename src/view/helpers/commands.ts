import { Dispatch } from 'redux';

import AddCommand from '../../business/commands/AddCommand';
import BaseCommand from '../../business/commands/BaseCommand';
import ChangeCanvasCommand from '../../business/commands/ChangeCanvasCommand';
import ChangeFiltersCommand from '../../business/commands/ChangeFiltersCommand';
import ChangeLayersCommand from '../../business/commands/ChangeLayersCommand';
import ChangeLayoutsCommand from '../../business/commands/ChangeLayoutsCommand';
import CropCommand from '../../business/commands/CropCommand';
import DeleteBackgroundCommand from '../../business/commands/DeleteBackgroundCommand';
import DeleteCommand from '../../business/commands/DeleteCommand';
import FlipCommand from '../../business/commands/FlipCommand';
import history from '../../business/commands/History';
import MoveCommand from '../../business/commands/MoveCommand';
import RecolorCommand from '../../business/commands/RecolorCommand';
import ReplaceCommand from '../../business/commands/ReplaceCommand';
import ResizeCommand from '../../business/commands/ResizeCommand';
import ResizeTextCommand from '../../business/commands/ResizeTextCommand';
import RotateCommand from '../../business/commands/RotateCommand';
import ToggleCanvasAvailability from '../../business/commands/ToggleCanvasAvailability';
import UpdateQRCommand from '../../business/commands/UpdateQRCommand';
import UpdateTextAlignCommand from '../../business/commands/UpdateTextAlignCommand';
import UpdateTextFamilyCommand from '../../business/commands/UpdateTextFamilyCommand';
import UpdateTextSizeCommand from '../../business/commands/UpdateTextSizeCommand';
import UpdateTextValueCommand from '../../business/commands/UpdateTextValueCommand';
import UseAsBackgroundCommand from '../../business/commands/UseAsBackgroundCommand';
import UseAsImageCommand from '../../business/commands/UseAsImageCommand';
import BaseElement from '../../business/elements/BaseElement';
import Canvas from '../../business/elements/Canvas';
import designer from '../../business/elements/Designer';
import createDesignerConfig from '../../business/factories/designerToConfigFactory';
import {
  IWithFiltersProperties,
  IWithPlaceholder,
  IWithTextFamily,
  IWithTextSize,
  IWithTextValue,
} from '../../business/interfaces/featuresInterfaces';
import { ICrop, IElement, IFlip, IPosition } from '../../business/interfaces/interfaces';
import consts from '../../models/constants/consts';
import { TextAligns } from '../../models/constants/designer';
import { saveDesign } from '../../services/designer/designer.service';
import { updateDesigner } from '../stores/designerStore/designer/designerActions';

let timer: NodeJS.Timeout;

export async function saveDesigner() {
  if (timer) clearTimeout(timer);
  const config = createDesignerConfig(designer);
  localStorage.setItem(consts.designer.LOCAL_STORAGE, JSON.stringify(config));
  console.log('designer saved', config);
  if (config.designId) {
    timer = setTimeout(() => saveDesign(config.designId, config), 5000);
  }
}

function updateAndSaveDesigner(dispatch: Dispatch, command: BaseCommand) {
  (async () => {
    await history.add(command);
    dispatch(updateDesigner(designer));
  })();
  saveDesigner();
}

export function commandAddElement(dispatch: Dispatch, element: BaseElement) {
  updateAndSaveDesigner(dispatch, new AddCommand(element));
}

export function commandUseAsImage(dispatch: Dispatch, oldBg: BaseElement, newBg: BaseElement, newImage: BaseElement) {
  updateAndSaveDesigner(dispatch, new UseAsImageCommand(oldBg, newBg, newImage));
}

export function commandUseAsBackground(
  dispatch: Dispatch,
  oldElement: BaseElement,
  newBg: BaseElement,
  oldBg: BaseElement
) {
  updateAndSaveDesigner(dispatch, new UseAsBackgroundCommand(oldElement, newBg, oldBg));
}

export function commandReplaceElement(dispatch: Dispatch, oldElement: BaseElement, newElement: BaseElement) {
  updateAndSaveDesigner(dispatch, new ReplaceCommand(oldElement, newElement));
}

export function commandDeleteElement(dispatch: Dispatch, elements: BaseElement[]) {
  updateAndSaveDesigner(dispatch, new DeleteCommand(elements));
}

export function commandDeleteBackground(dispatch: Dispatch, element: BaseElement) {
  updateAndSaveDesigner(dispatch, new DeleteBackgroundCommand(element));
}

export function commandChangeCanvas(dispatch: Dispatch, canvas: Canvas) {
  updateAndSaveDesigner(dispatch, new ChangeCanvasCommand(canvas));
}

export function commandCropElement(dispatch: Dispatch, prev: ICrop, next: ICrop, elementId: string) {
  updateAndSaveDesigner(dispatch, new CropCommand(prev, next, elementId));
}

export function commandFlipElement(dispatch: Dispatch, prev: IFlip, next: IFlip, elementId: string) {
  updateAndSaveDesigner(dispatch, new FlipCommand(prev, next, elementId));
}

export function commandMoveElement(dispatch: Dispatch, prev: IPosition, next: IPosition, elementId: string) {
  updateAndSaveDesigner(dispatch, new MoveCommand(prev, next, elementId));
}

export function commandResizeElement(dispatch: Dispatch, prev: IElement, next: IElement, elementId: string) {
  updateAndSaveDesigner(dispatch, new ResizeCommand(prev, next, elementId));
}

export function commandRotateElement(dispatch: Dispatch, prev: number, next: number, elementId: string) {
  updateAndSaveDesigner(dispatch, new RotateCommand(prev, next, elementId));
}

export function commandResizeText(
  dispatch: Dispatch,
  prev: IElement & IWithTextSize,
  next: IElement & IWithTextSize,
  elementId: string
) {
  updateAndSaveDesigner(dispatch, new ResizeTextCommand(prev, next, elementId));
}

export function commandUpdateQR<T>(dispatch: Dispatch, prev: T, next: T, elementId: string, isNotSelect: boolean) {
  updateAndSaveDesigner(dispatch, new UpdateQRCommand<T>(prev, next, elementId, isNotSelect));
}

export function commandUpdateTextValue(
  dispatch: Dispatch,
  prev: IElement & IWithTextValue & IWithPlaceholder,
  next: IElement & IWithTextValue & IWithPlaceholder,
  elementId: string
) {
  updateAndSaveDesigner(dispatch, new UpdateTextValueCommand(prev, next, elementId));
}

export function commandUpdateTextAlign(dispatch: Dispatch, prev: TextAligns, next: TextAligns, elementId: string) {
  updateAndSaveDesigner(dispatch, new UpdateTextAlignCommand(prev, next, elementId));
}

export function commandUpdateTextFamily(
  dispatch: Dispatch,
  prev: IElement & IWithTextFamily,
  next: IElement & IWithTextFamily,
  elementId: string,
  oldText: string,
  newText: string
) {
  updateAndSaveDesigner(dispatch, new UpdateTextFamilyCommand(prev, next, elementId, oldText, newText));
}

export function commandUpdateTextSize(
  dispatch: Dispatch,
  prev: IElement & IWithTextSize,
  next: IElement & IWithTextSize,
  elementId: string,
  oldText: string,
  newText: string
) {
  updateAndSaveDesigner(dispatch, new UpdateTextSizeCommand(prev, next, elementId, oldText, newText));
}

export function commandRecolorElement(dispatch: Dispatch, prev: string, next: string, elementId: string) {
  updateAndSaveDesigner(dispatch, new RecolorCommand(prev, next, elementId));
}

export function commandChangeFilters(
  dispatch: Dispatch,
  prev: IWithFiltersProperties,
  next: IWithFiltersProperties,
  elementId: string
) {
  updateAndSaveDesigner(dispatch, new ChangeFiltersCommand(prev, next, elementId));
}

// export function commandChangeLayers(dispatch: Dispatch, oldCanvas: BaseElement[], newCanvas: BaseElement[]) {
//   updateAndSaveDesigner(dispatch, new ChangeLayersCommand(oldCanvas, newCanvas));
// }

export function commandChangeLayers(
  dispatch: Dispatch,
  oldCanvas: BaseElement[],
  changePosEl: BaseElement,
  replacedEl: BaseElement
) {
  updateAndSaveDesigner(dispatch, new ChangeLayersCommand(oldCanvas, changePosEl, replacedEl));
}

export function commandChangeLayouts(dispatch: Dispatch, oldCanvas: BaseElement[], newCanvas: BaseElement[]) {
  updateAndSaveDesigner(dispatch, new ChangeLayoutsCommand(oldCanvas, newCanvas));
}

export function commandToggleCanvasAvailability(
  dispatch: Dispatch,
  canvasId: number,
  canvasName: string,
  disabled: boolean,
  oldElements: BaseElement[],
  newElements?: BaseElement[]
) {
  updateAndSaveDesigner(
    dispatch,
    new ToggleCanvasAvailability(canvasId, canvasName, disabled, oldElements, newElements)
  );
}

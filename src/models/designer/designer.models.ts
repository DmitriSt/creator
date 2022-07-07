import { Designer } from '../../business/elements/Designer';
import {
  BasePageModel,
  IElementConfig,
  ILayoutElementConfig,
  IPageConfig,
  IPositionConfig,
} from '../../business/interfaces/configsInterfaces';
import {
  ICanvasLocation,
  IDimension,
  ILayoutElementContent,
  IMainDesignerConfig,
  IPosition,
} from '../../business/interfaces/interfaces';
import { IBaseObj, ProductTypes } from '../commonPage.models';
import { ElementStatuses } from '../constants/designer';
import { DragDropElementType } from './tabBar.models';

export type DesignerStateType = {
  instance: Designer;
  draggableElement: DragDropElementType<unknown>;
  coefficient: number;
  zoom: number;
  status: ElementStatuses;
  activeTemplate: string;
  isShowPalette: boolean;
  additionalColor: string;
  mainConfig: IMainDesignerConfig;
  imagesOnCanvas: number;
  isShowPreview: boolean;
  favourites: {
    Layouts: ILayoutElementConfig<ILayoutElementContent>[];
    Images: any[];
    Backgrounds: any[];
    Clipart: any[];
  };
  favouriteIds: string[];
};

export type DesignerProductStateType = {
  backgroundSelector: BackgroundSelector | null;
  colors: DesignerProductColor[] | null;
  description: string | null;
  fonts: DesignerProductFont[] | null;
  name: string | null;
  pages: DesignerProductPage[] | null;
  productId: number | null;
  size: IDimension | null;
  sku: string | null;
  supportedDesigners: DesignerTypes | null;
  type: ProductTypes | null;
};

export type DesignerProductConfig = {
  backgroundSelector: BackgroundSelector;
  colors: DesignerProductColor[] | null;
  description: string | null;
  fonts: DesignerProductFont[] | null;
  name: string | null;
  pages: DesignerProductPage[];
  productId: number;
  size: IDimension;
  sku: string | null;
  supportedDesigners: DesignerTypes;
  type: ProductTypes;
};

export type BackgroundSelector = {
  items: BackgroundSelectorItem[] | null;
  name: string | null;
  seletorType: StocksDesignTimeUsage;
};

export type BackgroundSelectorItem = {
  text: string | null;
  value: string | null;
  icon: string | null;
  url: IBaseObj | null;
  description: string | null;
};

export type DesignerProductColor = {
  code: string;
  description: string;
  name: string;
};

export type DesignerProductFont = {
  bold: string;
  boldItalic: string;
  italic: string;
  normal: string;
  text: string;
};

export type DesignerProductPage = {
  canvases: DesignerProductCanvas[];
  id: number;
};

export type TextConfig = {
  isAllowed: boolean;
  isShadowAllowed: boolean;
};

export interface IPictureConfig extends TextConfig {
  minCount: number;
  maxCount: number;
  sources: ImageSources[];
}

export type BackgroundConfig = {
  type: BackgroundType;
  isTransparent: boolean;
  isBackgroundImageRequired: boolean;
  sources: ImageSources[];
};

export type DesignerProductCanvas = {
  id: number;
  backgroundOptions: BackgroundConfig;
  pictureOptions: IPictureConfig;
  textOptions: TextConfig;
  colorOption: ColorOption;
  bleed: IDimension;
  isBleedless: boolean;
  name: string;
  description: string;
  position: IPositionConfig;
  size: IDimension;
  location: ICanvasLocation;
};

export enum StocksDesignTimeUsage {} // numbers

export enum DesignerTypes {} // numbers

export enum ColorOption {} // numbers

export enum ImageSources {} // numbers

export enum BackgroundType {
  COLOR,
  IMAGE_AND_COLOR,
}

export type DesignerModel = {
  productId: number;
  templateId: string;
  projectName: string;
  pages: IPageConfig[];
  designId: string;
  layoutId: string | null;
};

export type PageModelDTO = BasePageModel<CanvasDTO>;

export type CanvasDTO = {
  layoutId: string;
  name: string;
  width: number;
  height: number;
  items: IElementConfig[];
  id: number;
  left: number;
  top: number;
  bleed: IDimension;
};

export type SVGCanvasDTO = {
  svg: string;
  pageId: number;
  canvasId: number;
  canvasName: string;
};

export type SVGPageDTO = {
  svg: string;
  pageId: number;
  canvasId: -1;
  pageName: string;
  canvasSVGList: SVGCanvasDTO[];
};

export type FloatingPanelPositionType = {
  left: string;
  top: string;
};

export type DesignerElementType = {
  id: string;
  thumbnail: boolean;
  cropMoveShift?: IPosition;
};

export type BorderDimensions = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

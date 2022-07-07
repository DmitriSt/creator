import { ElementTypes, TextTypes } from '../../models/constants/designer';
import { FormatTypes } from '../../models/designer/qr.models';
import {
  IRotatable,
  IWithColor,
  IWithFilters,
  IWithImage,
  IWithPlaceholder,
  IWithTextAlign,
  IWithTextValue,
} from './featuresInterfaces';
import { IDimension } from './interfaces';

export interface IPositionConfig {
  left: number;
  top: number;
}

export interface IDesignerConfig {
  productId: number;
  designId: string;
  projectName: string;
  templateId: string;
  layoutId: string;
  pages: IPageConfig[];
}

export type BasePageModel<T> = {
  id: number;
  name: string;
  width: number;
  height: number;
  backgroundImage: string;
  overlayImage: string;
  canvases: T[];
};

export interface IPageConfig {
  id: number;
  name: string;
  width: number;
  height: number;
  backgroundUrl: string;
  overlayUrl: string;
  canvases: ICanvasConfig[];
}

export interface ICanvasConfig extends IDimension {
  layoutId: string;
  name: string;
  items: IElementConfig[];
  id: number;
  left: number;
  top: number;
  bleed: IDimension;
  disabled?: boolean;
}

export interface IElementConfig extends IPositionConfig, IDimension {
  type: ElementTypes;
}

export interface IFlipConfig {
  verticalFlip: boolean;
  horizontalFlip: boolean;
}

export interface ICropLimitsConfig extends IPositionConfig, IDimension {}

export interface ICropConfig {
  crop: ICropLimitsConfig;
}

export interface ITemplateElementConfig extends IElementConfig, IWithImage {}

export interface ILayoutElementConfig<T> {
  $type: string;
  cardId: string;
  cardType: number;
  dataApi: string;
  url: string;
  json: T;
}

export interface IImageElementConfig
  extends IElementConfig,
    IWithFilters,
    IFlipConfig,
    IRotatable,
    IWithImage,
    ICropConfig {}

export interface IBackgroundImageElementConfig
  extends IElementConfig,
    IWithFilters,
    IFlipConfig,
    IWithImage,
    ICropConfig {}

export interface IBackgroundColorElementConfig extends IElementConfig, IWithColor {}

export interface IStickerElementConfig
  extends IElementConfig,
    IFlipConfig,
    IRotatable,
    IWithImage,
    IWithColor,
    ICropConfig {}

export interface IQRElementConfig extends IElementConfig, IWithColor, IRotatable {
  format: FormatTypes;
  value: unknown;
}

export interface IWithTextConfig extends IWithTextAlign, IWithTextValue, IWithColor {
  manuallyResized?: boolean;
  textType?: TextTypes;
}

export interface ITextElementConfig extends IElementConfig, IWithTextConfig, IRotatable, IWithPlaceholder {}

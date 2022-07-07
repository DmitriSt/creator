import { TextAligns, TextFontType, TextTypes } from '../../models/constants/designer';
import { ICrop, IFlip } from './interfaces';

export interface IWithImage {
  originalWidth: number;
  originalHeight: number;
  source: string;
  url: string;
  mediumUrl: string;
  thumbUrl: string;
  placeholder?: boolean;
}

export interface IWithFiltersProperties {
  isGrayscale: boolean;
  isInverted: boolean;
  colorization: string;
  contrast: number;
  brightness: number;
  blur: number;
}

export interface IWithFilters {
  filters: IWithFiltersProperties;
}

export interface IWithColor {
  color: string;
}

export interface IWithTextAlign {
  align: TextAligns;
}

export interface IWithPlaceholder {
  placeholder: boolean;
}

export interface IWithTextSize {
  fontSize: number;
}

export interface IWithTextFamily {
  fontFamily: TextFontType;
}

export interface IWithTextValue {
  text: string;
}

export interface IWithText
  extends IWithTextAlign,
    IWithPlaceholder,
    IWithTextSize,
    IWithTextFamily,
    IWithTextValue,
    IWithColor {
  manuallyResized?: boolean;
  textType?: TextTypes;
}

export interface IMovable {
  x: number;
  y: number;
}

export interface IFlippable {
  flip: IFlip;
}

export interface IRotatable {
  rotation: number;
}

export interface ICroppable {
  crop: ICrop;
}

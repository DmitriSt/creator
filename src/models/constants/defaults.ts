import { IWithFiltersProperties } from '../../business/interfaces/featuresInterfaces';
import { IBorder, IFlip } from '../../business/interfaces/interfaces';
import consts from './consts';

export const defaultFlip: IFlip = {
  horizontal: false,
  vertical: false,
};

export const defaultBorder: IBorder = {
  width: 0,
  color: '#ffffff',
  radius: 0,
};

export const defaultFilters: IWithFiltersProperties = {
  isGrayscale: false,
  isInverted: false,
  colorization: '',
  contrast: consts.filters.DEFAULT_CONTRAST,
  brightness: consts.filters.DEFAULT_BRIGHTNESS,
  blur: consts.filters.DEFAULT_BLUR,
};

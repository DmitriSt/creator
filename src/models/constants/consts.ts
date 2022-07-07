import { TextFontType } from './designer';

const consts = {
  designer: {
    API: 'https://api.printcreator.com/api/v1/',
    BACKGROUND_DROP_ZONE_PADDING: 50,
    BRAND_COLOR: '#42708A',
    DEFAULT_FONT: 'OpenSans' as TextFontType,
    EMPTY_TEXT: 'Add text here',
    LOCAL_STORAGE: 'ePrintCreatorData',
    MINIMAL_FONT_SIZE: 8,
    MINIMAL_TEXT_ELEMENT_WIDTH: 50,
    QR_BORDER_MAX_WIDTH: 6,
  },
  filters: {
    DEFAULT_BLUR: 0,
    DEFAULT_BLUR_SLIDER: 0,
    DEFAULT_BRIGHTNESS: 1,
    DEFAULT_BRIGHTNESS_SLIDER: 0,
    DEFAULT_CONTRAST: 1,
    DEFAULT_CONTRAST_SLIDER: 0,
    MAX_BLUR: 6,
    MAX_BLUR_SLIDER: 100,
    MAX_BRIGHTNESS: 3,
    MAX_BRIGHTNESS_SLIDER: 100,
    MAX_CONTRAST: 3,
    MAX_CONTRAST_SLIDER: 100,
    MIN_BLUR: 0,
    MIN_BLUR_SLIDER: 0,
    MIN_BRIGHTNESS: 0.05,
    MIN_BRIGHTNESS_SLIDER: -100,
    MIN_CONTRAST: 0.1,
    MIN_CONTRAST_SLIDER: -100,
  },
  resizeSelector: {
    BORDER_RATIO: 0.7,
    HORIZONTAL_RESIZER_HEIGHT: 24,
    PADDING: 4,
    VERTICAL_RESIZER_WIDTH: 24,
  },
  tabBar: {
    DEFAULT_WIDTH: 300,
  },
  thumbnails: {
    MAX_HEIGHT: 200,
    MAX_WIDTH: 183,
  },
  previews: {
    MAX_ELEMENTS_COUNT: 6,
    PLACEMENT_SIZE_RATIO: 4,
  },
  uploadFiles: {
    UPLOAD_TYPES: '.jpg, .jpeg, .png, .tiff',
  },
  placeholderImage: {
    HEIGHT: 64,
    WIDTH: 82,
  },
  imageSizes: {
    MEDIUM: 450,
    SMALL: 110,
  },
};

export function updateColor(color: string) {
  consts.designer.BRAND_COLOR = color;
}

export default consts;

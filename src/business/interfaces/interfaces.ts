import { TabDragDropComponents } from '../../models/designer/tabBar.models';
import BaseElement from '../elements/BaseElement';
import Canvas from '../elements/Canvas';
import { IElementConfig } from './configsInterfaces';
import { IRotatable, IWithText } from './featuresInterfaces';

export interface IPage extends IPageDimension {
  canvases: Canvas[];
}

export interface ICanvas extends IDimension {
  name: string;
  elements: BaseElement[];
}

export interface IBorder {
  width: number;
  color: string;
  radius: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IPageDimension {
  name: string;
  width: number;
  height: number;
  backgroundUrl: string;
  overlayUrl: string;
  id: number;
}

export interface IDimension {
  width: number;
  height: number;
}

export interface ICanvasLocation {
  top: number;
  left: number;
}

export interface IElement extends IPosition, IDimension {}

export interface IFlip {
  horizontal: boolean;
  vertical: boolean;
}

export interface IVector extends IPosition {}

export interface ICrop extends IPosition, IDimension {}

export interface ITemplateElement {
  element: {
    sourceId: string;
    originalWidth: number;
    originalHeight: number;
    title: string;
    thumb: string;
    jsonText: string;
  };
}

export interface ILayoutElementItem extends IElementConfig, IWithText, IRotatable {}

export interface ILayoutElementContent {
  layoutId: string;
  name: string;
  width: number;
  height: number;
  items: ILayoutElementItem[];
}

export interface ILayoutElement {
  url: string;
  json: ILayoutElementContent;
}

export interface ITabElement {
  element: ITabbarListElement;
  favourites?: boolean;
}

export interface ITabElementKeys {
  id: string;
  width: number;
  height: number;
  url: string;
  mediumUrl: string;
  thumbnailUrl: string;
  name: string;
  type: number;
  description: string;
  upload?: boolean;
}

export interface IPreviewElementPosition extends IPosition {
  coefficient: number;
}

export interface IPreviewElement<T> {
  type: TabDragDropComponents;
  position: IPreviewElementPosition;
  payload: T;
  bgReplace?: boolean;
  zoom?: number;
}

export interface INewImage {
  image: {
    fileName: string;
    thumbnailUrl: string;
    upload: boolean;
  };
}

export interface IImageWrapper {
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  transform: string;
}

export interface INewImageUpload {
  image: {
    id?: string;
    sourceId?: string;
    thumbnailUrl: string;
    mediumUrl: string;
    url: string;
    width: number;
    height: number;
    fileName: string;
    upload: boolean;
  };
}

export interface ITabData<T> {
  count: number;
  lists: T[];
  startPage: number;
}

// TODO remove after change LayoutsTab
export interface IRowRenderer {
  key: string;
  index: number;
  parent: unknown;
  style: unknown;
}
export interface IUploadProps {
  callback: (files: File[]) => void;
  designId: string;
}

export interface IMainDesignerConfig {
  backgrounds: ITabApi;
  clipArts: ITabApi;
  designSurfaceConfig: ISurfaceConfig;
  designTemplates: ITabApi;
  images: ITabApi;
  pageConfig: IPageConfig;
  sidePanelConfig: ITabbarConfig;
  textLayouts: ITabApi;
  uploadedImages: ITabApi;
  showingTabs: string[];
}

export interface ITabbarConfig {
  showBackgrounds?: boolean;
  showCliparts?: boolean;
  showFavourites?: boolean;
  showImages?: boolean;
  showLayouts?: boolean;
  showQRCode?: boolean;
  showSettings?: boolean;
  showTemplates?: boolean;
  showTexts?: boolean;
}

export interface IPageConfig {
  showPreview: boolean;
  showAddToCart: boolean;
  showSignIn: boolean;
  showFooter: boolean;
  showHeader: boolean;
}

export interface ISurfaceConfig {
  enableRulers: boolean;
  enableHints: boolean;
  enableCropMarks: boolean;
}

export interface ITabApi {
  categories: string | null;
  search: string;
}

export interface ITabbarListElementImage {
  description: string;
  height: number;
  isTransparent: boolean;
  isVector: boolean;
  mediumUrl: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  width: number;
}

export interface ITabbarListElement {
  $type: string;
  cardId: string;
  cardType: number;
  image: ITabbarListElementImage;
}

export interface ITabCategoryDTO {
  $type: string;
  cardId: string;
  cardType: number;
  category: ITabbarList;
}

export interface ITabbarList {
  description: string;
  elements?: ITabbarListElement[];
  imageCount: number;
  imageSearch: string;
  name: string;
}

export interface IBaseSearchResult<T> {
  count: number;
  lists: T[];
}

export interface ICategoryUpdate {
  index: number;
  elements: ITabbarListElement[];
}

export interface IStatusInfo {
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

export interface ILoadMap {
  [key: string]: IStatusInfo;
}

import { IImageWrapper, INewImage, INewImageUpload, ITabbarList, ITabData } from '../../business/interfaces/interfaces';

export type TabBarStateType = {
  order: TabTypes[];
  activeTab: TabTypes;
  tabBarWidth: number;

  templateTab: ITabData<any>;
  layoutTab: ITabData<any>;
  userImagesTab: ITabData<any>;
  imagesTab: ITabData<ITabbarList>;
  backgroundTab: ITabData<ITabbarList>;
  stickerTab: ITabData<ITabbarList>;

  isBGEnter: boolean;
  imageEnter: string;
  imagesWrappers: IImageWrapper[];

  newImages: INewImageUpload[];
  newThumbnails: INewImage[];
  filesProgress: number;
  chunksComplete: number;
  countChunks: number;
  imageProgress: number;
};

export type TabTypes = TabTools | TabSettings;

export enum TabTools {
  Templates = 'Templates',
  Layouts = 'Layouts',
  Images = 'Images',
  Backgrounds = 'Backgrounds',
  Clipart = 'Clipart',
  Text = 'Text',
  QR = 'QR',
  Favourites = 'Favourites',
}

export enum TabSettings {
  ProductSettings = 'Product Settings',
}

export enum TabDragDropComponents {
  Template,
  Layout,
  Background,
  Color,
  QR,
  Image,
  Sticker,
  Text,
}

export type TabIconsType = {
  [tab in TabTools | TabSettings]: JSX.Element;
};

export type DragDropElementType<T> = {
  type: TabDragDropComponents;
  payload: T;
};

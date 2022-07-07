import {
  ICategoryUpdate,
  INewImage,
  INewImageUpload,
  ITabbarList,
  ITabData,
} from '../../../../business/interfaces/interfaces';
import { TabTypes } from '../../../../models/designer/tabBar.models';
import ActionTypesDesigner from '../actionTypes';

export function initTabBarStore(tabs: TabTypes[]) {
  return {
    type: ActionTypesDesigner.INIT_TABBAR_STORE,
    payload: tabs,
  } as const;
}

export function setActiveTab(tab: TabTypes) {
  return {
    type: ActionTypesDesigner.SET_TABBAR_ACTIVE_TAB,
    payload: tab,
  } as const;
}

export function setTabBarWidth(width: number) {
  return {
    type: ActionTypesDesigner.SET_TABBAR_WIDTH,
    payload: width,
  } as const;
}

export function setFilesProgress(length: number) {
  return {
    type: ActionTypesDesigner.SET_FILES_PROGRESS,
    payload: length,
  } as const;
}

export function setImageProgress(percentage: number) {
  return {
    type: ActionTypesDesigner.SET_IMAGE_PROGRESS,
    payload: percentage,
  } as const;
}

export function setChunksCount(chunksCount: number) {
  return {
    type: ActionTypesDesigner.SET_CHUNKS_ALL_COUNT,
    payload: chunksCount,
  } as const;
}

export function setClearChunks() {
  return {
    type: ActionTypesDesigner.SET_CLEAR_CHUNKS,
  } as const;
}

export function setNewThumbnails(newImages: INewImage[]) {
  return {
    type: ActionTypesDesigner.SET_NEW_THUMBNAILS,
    payload: newImages,
  } as const;
}

export function setImageData(imageData: INewImageUpload) {
  return {
    type: ActionTypesDesigner.SET_IMAGE_DATA,
    payload: imageData,
  } as const;
}

export function setClearImageData() {
  return {
    type: ActionTypesDesigner.SET_CLEAR_IMAGE_DATA,
  } as const;
}

export function setTemplateTab(templatesData: ITabData<any>) {
  return {
    type: ActionTypesDesigner.SET_TEMPLATES_TAB,
    payload: templatesData,
  } as const;
}

export function setLayoutsTab(layoutsData: ITabData<any>) {
  return {
    type: ActionTypesDesigner.SET_LAYOUTS_TAB,
    payload: layoutsData,
  } as const;
}

export function setUserImagesTab(imagesData: ITabData<any>) {
  return {
    type: ActionTypesDesigner.SET_USER_IMAGES_TAB,
    payload: imagesData,
  } as const;
}

export function setImagesTab(imagesData: ITabData<ITabbarList>) {
  return {
    type: ActionTypesDesigner.SET_IMAGES_TAB,
    payload: imagesData,
  } as const;
}

export function updateImagesTabCategory(dto: ICategoryUpdate) {
  return {
    type: ActionTypesDesigner.UPDATE_IMAGES_TAB_CATEGORY,
    payload: dto,
  } as const;
}

export function setBackgroundsTab(bgData: ITabData<ITabbarList>) {
  return {
    type: ActionTypesDesigner.SET_BG_TAB,
    payload: bgData,
  } as const;
}

export function updateBgTabCategory(dto: ICategoryUpdate) {
  return {
    type: ActionTypesDesigner.UPDATE_BG_TAB_CATEGORY,
    payload: dto,
  } as const;
}

export function setStickersTab(stickersData: ITabData<ITabbarList>) {
  return {
    type: ActionTypesDesigner.SET_STICKERS_TAB,
    payload: stickersData,
  } as const;
}

export function updateStickersTabCategory(dto: ICategoryUpdate) {
  return {
    type: ActionTypesDesigner.UPDATE_STICKERS_TAB_CATEGORY,
    payload: dto,
  } as const;
}

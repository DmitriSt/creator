import { Designer } from '../../../../business/elements/Designer';
import { ILayoutElementConfig } from '../../../../business/interfaces/configsInterfaces';
import {
  IImageWrapper,
  ILayoutElementContent,
  IMainDesignerConfig,
  ITabbarListElement,
  ITabbarListElementImage,
} from '../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../models/constants/designer';
import { DragDropElementType } from '../../../../models/designer/tabBar.models';
import ActionTypesDesigner from '../actionTypes';

export function updateDesigner(designer: Designer) {
  return {
    type: ActionTypesDesigner.UPDATE_DESIGNER_STORE,
    payload: designer,
  } as const;
}

export function setStatus(status: ElementStatuses) {
  return {
    type: ActionTypesDesigner.SET_STATUS,
    payload: status,
  } as const;
}

export function setCoefficient(coefficient: number) {
  return {
    type: ActionTypesDesigner.SET_COEFFICIENT,
    payload: coefficient,
  } as const;
}

export function setZoom(zoom: number) {
  return {
    type: ActionTypesDesigner.SET_ZOOM,
    payload: zoom,
  } as const;
}

export function setDraggableElement<T>(draggable: DragDropElementType<T> | null) {
  return {
    type: ActionTypesDesigner.SET_DRAGGABLE_ELEMENT,
    payload: draggable,
  } as const;
}

export function setTabBarWidth(width: number) {
  return {
    type: ActionTypesDesigner.SET_TABBAR_WIDTH,
    payload: width,
  } as const;
}

export function setActiveTemplate(id: string) {
  return {
    type: ActionTypesDesigner.SET_ACTIVE_TEMPLATE,
    payload: id,
  } as const;
}

export function setBackgroundEnter(isBgEnter: boolean) {
  return {
    type: ActionTypesDesigner.SET_BG_ENTER,
    payload: isBgEnter,
  } as const;
}

export function setImageEnter(imageID: string) {
  return {
    type: ActionTypesDesigner.SET_IMAGE_ENTER,
    payload: imageID,
  } as const;
}

export function setImagesWrappers(imagesWrappers: IImageWrapper[]) {
  return {
    type: ActionTypesDesigner.SET_IMAGES_WRAPPERS,
    payload: imagesWrappers,
  } as const;
}

export function setShowPalette(flag: boolean) {
  return {
    type: ActionTypesDesigner.SET_SHOW_PALETTE,
    payload: flag,
  } as const;
}

export function setAdditionalColor(color: string) {
  return {
    type: ActionTypesDesigner.SET_ADDITIONAL_COLOR,
    payload: color,
  } as const;
}

export function setMainConfig(config: IMainDesignerConfig) {
  const showingTabs = [];
  const tabs = config.sidePanelConfig;
  // TODO optimization
  // if (tabs.showTemplates) {
  //   showingTabs.push('Templates');
  // }
  // if (tabs.showBackgrounds) {
  //   showingTabs.push('Backgrounds');
  // }
  // if (tabs.showCliparts) {
  //   showingTabs.push('Clipart');
  // }
  // if (tabs.showImages) {
  //   showingTabs.push('Images');
  // }
  // if (tabs.showLayouts) {
  //   showingTabs.push('Layouts');
  // }
  // if (tabs.showQRCode) {
  //   showingTabs.push('QR');
  // }
  if (tabs.showTexts) {
    showingTabs.push('Text');
  }
  if (tabs.showFavourites) {
    showingTabs.push('Favourites');
  }
  // todo remove
  // showingTabs.push('Templates');
  showingTabs.push('Layouts');
  showingTabs.push('Images');
  showingTabs.push('Backgrounds');
  showingTabs.push('Clipart');
  showingTabs.push('QR');

  config.showingTabs = showingTabs;
  return {
    type: ActionTypesDesigner.SET_MAIN_CONFIG,
    payload: config,
  } as const;
}

export function setImagesOnCanvas(count: number) {
  return {
    type: ActionTypesDesigner.SET_IMAGES_ON_CANVAS,
    payload: count,
  } as const;
}

export function setShowPreview(flag: boolean) {
  return {
    type: ActionTypesDesigner.SET_SHOW_PREVIEW,
    payload: flag,
  } as const;
}

export function setFavouriteLayout(element: ILayoutElementConfig<ILayoutElementContent>) {
  return {
    type: ActionTypesDesigner.SET_FAVOURITES_LAYOUTS,
    payload: element,
  } as const;
}

export function setFavouriteId(id: string) {
  return {
    type: ActionTypesDesigner.SET_FAVOURITE_ID,
    payload: id,
  } as const;
}

export function removeFavouriteEl(id: string, type: string, list: any) {
  return {
    type: ActionTypesDesigner.REMOVE_FAVOURITE_EL,
    payload: { id, type, list },
  } as const;
}

export function setFavouriteImage(element: ITabbarListElementImage) {
  return {
    type: ActionTypesDesigner.SET_FAVOURITES_IMAGES,
    payload: element,
  } as const;
}

export function setFavouriteBg(element: ITabbarListElement) {
  return {
    type: ActionTypesDesigner.SET_FAVOURITES_BGS,
    payload: element,
  } as const;
}

export function setFavouriteSticker(element: ITabbarListElement) {
  return {
    type: ActionTypesDesigner.SET_FAVOURITES_STICKERS,
    payload: element,
  } as const;
}

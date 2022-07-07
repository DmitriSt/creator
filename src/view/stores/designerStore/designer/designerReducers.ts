import cloneDeep from 'lodash.clonedeep';

import { ElementStatuses } from '../../../../models/constants/designer';
import { DesignerStateType } from '../../../../models/designer/designer.models';
import ActionTypesDesigner from '../actionTypes';
import {
  removeFavouriteEl,
  setActiveTemplate,
  setAdditionalColor,
  setCoefficient,
  setDraggableElement,
  setFavouriteBg,
  setFavouriteId,
  setFavouriteImage,
  setFavouriteLayout,
  setFavouriteSticker,
  setImagesOnCanvas,
  setMainConfig,
  setShowPalette,
  setShowPreview,
  setStatus,
  setZoom,
  updateDesigner,
} from './designerActions';

const defaultState: DesignerStateType = {
  instance: null,
  draggableElement: null,
  coefficient: 1,
  zoom: 1,
  status: ElementStatuses.Stable,
  activeTemplate: '',
  isShowPalette: false,
  additionalColor: '#ffffff',
  mainConfig: null,
  imagesOnCanvas: 0,
  isShowPreview: false,
  favourites: {
    Layouts: [],
    Images: [],
    Backgrounds: [],
    Clipart: [],
  },
  favouriteIds: [],
};

export type DesignerActionType =
  | ReturnType<typeof setMainConfig>
  | ReturnType<typeof updateDesigner>
  | ReturnType<typeof setCoefficient>
  | ReturnType<typeof setZoom>
  | ReturnType<typeof setStatus>
  | ReturnType<typeof setDraggableElement>
  | ReturnType<typeof setActiveTemplate>
  | ReturnType<typeof setShowPalette>
  | ReturnType<typeof setAdditionalColor>
  | ReturnType<typeof setImagesOnCanvas>
  | ReturnType<typeof setShowPreview>
  | ReturnType<typeof setFavouriteLayout>
  | ReturnType<typeof setFavouriteImage>
  | ReturnType<typeof setFavouriteBg>
  | ReturnType<typeof setFavouriteSticker>
  | ReturnType<typeof setFavouriteId>
  | ReturnType<typeof removeFavouriteEl>;

export function designerReducer(state = defaultState, action: DesignerActionType): DesignerStateType {
  switch (action.type) {
    case ActionTypesDesigner.UPDATE_DESIGNER_STORE:
      return {
        ...state,
        instance: cloneDeep(action.payload),
      };

    case ActionTypesDesigner.SET_COEFFICIENT:
      return {
        ...state,
        coefficient: action.payload,
      };

    case ActionTypesDesigner.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload,
      };

    case ActionTypesDesigner.SET_DRAGGABLE_ELEMENT:
      return {
        ...state,
        draggableElement: action.payload,
      };

    case ActionTypesDesigner.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case ActionTypesDesigner.SET_ACTIVE_TEMPLATE:
      return {
        ...state,
        activeTemplate: action.payload,
      };
    case ActionTypesDesigner.SET_SHOW_PALETTE:
      return {
        ...state,
        isShowPalette: action.payload,
      };
    case ActionTypesDesigner.SET_ADDITIONAL_COLOR:
      return {
        ...state,
        additionalColor: action.payload,
      };
    case ActionTypesDesigner.SET_MAIN_CONFIG:
      return {
        ...state,
        mainConfig: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGES_ON_CANVAS:
      return {
        ...state,
        imagesOnCanvas: action.payload,
      };
    case ActionTypesDesigner.SET_SHOW_PREVIEW:
      return {
        ...state,
        isShowPreview: action.payload,
      };
    case ActionTypesDesigner.SET_FAVOURITES_LAYOUTS:
      return {
        ...state,
        favourites: {
          ...state.favourites,
          Layouts: [...state.favourites.Layouts, action.payload],
        },
      };
    case ActionTypesDesigner.SET_FAVOURITES_IMAGES:
      return {
        ...state,
        favourites: {
          ...state.favourites,
          Images: [...state.favourites.Images, action.payload],
        },
      };
    case ActionTypesDesigner.SET_FAVOURITES_BGS:
      return {
        ...state,
        favourites: {
          ...state.favourites,
          Backgrounds: [...state.favourites.Backgrounds, action.payload],
        },
      };
    case ActionTypesDesigner.SET_FAVOURITES_STICKERS:
      return {
        ...state,
        favourites: {
          ...state.favourites,
          Clipart: [...state.favourites.Clipart, action.payload],
        },
      };
    case ActionTypesDesigner.SET_FAVOURITE_ID:
      return {
        ...state,
        favouriteIds: [...state.favouriteIds, action.payload],
      };
    case ActionTypesDesigner.REMOVE_FAVOURITE_EL:
      return {
        ...state,
        favouriteIds: state.favouriteIds.filter((ids) => ids !== action.payload.id),
        favourites: {
          ...state.favourites,
          [action.payload.type]: action.payload.list,
        },
      };

    default:
      return state;
  }
}

import consts from '../../../../models/constants/consts';
import { TabBarStateType } from '../../../../models/designer/tabBar.models';
import ActionTypesDesigner from '../actionTypes';
import { setBackgroundEnter, setImageEnter, setImagesWrappers } from '../designer/designerActions';
import {
  initTabBarStore,
  setActiveTab,
  setBackgroundsTab,
  setChunksCount,
  setClearChunks,
  setClearImageData,
  setFilesProgress,
  setImageData,
  setImageProgress,
  setImagesTab,
  setLayoutsTab,
  setNewThumbnails,
  setStickersTab,
  setTabBarWidth,
  setTemplateTab,
  setUserImagesTab,
  updateBgTabCategory,
  updateImagesTabCategory,
  updateStickersTabCategory,
} from './tabBarActions';

const defaultState: TabBarStateType = {
  order: [],
  activeTab: null,
  tabBarWidth: consts.tabBar.DEFAULT_WIDTH,

  templateTab: null,
  layoutTab: null,
  userImagesTab: null,
  imagesTab: null,
  backgroundTab: null,
  stickerTab: null,

  isBGEnter: false,
  imageEnter: '',
  imagesWrappers: [],

  filesProgress: 0,
  imageProgress: 0,
  chunksComplete: 0,
  countChunks: 0,
  newImages: [],
  newThumbnails: [],
};

export type TabBarActionType =
  | ReturnType<typeof setActiveTab>
  | ReturnType<typeof initTabBarStore>
  | ReturnType<typeof setTabBarWidth>
  | ReturnType<typeof setFilesProgress>
  | ReturnType<typeof setChunksCount>
  | ReturnType<typeof setClearChunks>
  | ReturnType<typeof setImageData>
  | ReturnType<typeof setImageProgress>
  | ReturnType<typeof setNewThumbnails>
  | ReturnType<typeof setBackgroundEnter>
  | ReturnType<typeof setImageEnter>
  | ReturnType<typeof setImagesWrappers>
  | ReturnType<typeof setClearImageData>
  | ReturnType<typeof setTemplateTab>
  | ReturnType<typeof setLayoutsTab>
  | ReturnType<typeof setUserImagesTab>
  | ReturnType<typeof setImagesTab>
  | ReturnType<typeof setBackgroundsTab>
  | ReturnType<typeof updateImagesTabCategory>
  | ReturnType<typeof updateBgTabCategory>
  | ReturnType<typeof updateStickersTabCategory>
  | ReturnType<typeof setStickersTab>;

export function tabBarReducer(state = defaultState, action: TabBarActionType) {
  switch (action.type) {
    case ActionTypesDesigner.INIT_TABBAR_STORE:
      return {
        ...state,
        activeTab: action.payload[0],
        order: action.payload,
      };
    case ActionTypesDesigner.SET_TABBAR_WIDTH:
      return {
        ...state,
        tabBarWidth: action.payload,
      };
    case ActionTypesDesigner.SET_TABBAR_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    case ActionTypesDesigner.SET_FILES_PROGRESS:
      return {
        ...state,
        filesProgress: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGE_PROGRESS:
      return {
        ...state,
        imageProgress: action.payload,
        chunksComplete: state.chunksComplete + 1,
      };
    case ActionTypesDesigner.SET_CHUNKS_ALL_COUNT:
      return {
        ...state,
        countChunks: action.payload,
      };
    case ActionTypesDesigner.SET_CLEAR_CHUNKS:
      return {
        ...state,
        chunksComplete: 0,
      };
    case ActionTypesDesigner.SET_NEW_THUMBNAILS:
      return {
        ...state,
        newThumbnails: action.payload,
      };
    case ActionTypesDesigner.SET_BG_ENTER:
      return {
        ...state,
        isBGEnter: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGE_ENTER:
      return {
        ...state,
        imageEnter: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGES_WRAPPERS:
      return {
        ...state,
        imagesWrappers: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGE_DATA:
      return {
        ...state,
        newImages: [
          ...state.newImages,
          {
            image: {
              sourceId: action.payload.image.id || null,
              thumbnailUrl: `${action.payload.image.thumbnailUrl || ''}`,
              mediumUrl: `${action.payload.image.mediumUrl || ''}`,
              url: `${action.payload.image.url || ''}`,
              width: action.payload.image.width || null,
              height: action.payload.image.height || null,
              fileName: action.payload.image.fileName || null,
              upload: false,
            },
          },
        ],
      };
    case ActionTypesDesigner.SET_CLEAR_IMAGE_DATA:
      return {
        ...state,
        newImages: [],
        newThumbnails: [],
      };
    case ActionTypesDesigner.SET_TEMPLATES_TAB:
      return {
        ...state,
        templateTab: action.payload,
      };
    case ActionTypesDesigner.SET_LAYOUTS_TAB:
      return {
        ...state,
        layoutTab: action.payload,
      };
    case ActionTypesDesigner.SET_USER_IMAGES_TAB:
      return {
        ...state,
        userImagesTab: action.payload,
      };
    case ActionTypesDesigner.SET_IMAGES_TAB:
      return {
        ...state,
        imagesTab: action.payload,
      };
    case ActionTypesDesigner.UPDATE_IMAGES_TAB_CATEGORY:
      return {
        ...state,
        imagesTab: {
          ...state.imagesTab,
          lists: state.imagesTab.lists.map((item, index) => {
            if (index === action.payload.index) {
              return {
                ...item,
                elements: action.payload.elements,
              };
            }
            return item;
          }),
        },
      };
    case ActionTypesDesigner.SET_BG_TAB:
      if (state.backgroundTab) {
        return {
          ...state,
          backgroundTab: action.payload,
        };
      }
      return {
        ...state,
        backgroundTab: action.payload,
      };
    case ActionTypesDesigner.UPDATE_BG_TAB_CATEGORY:
      return {
        ...state,
        backgroundTab: {
          ...state.backgroundTab,
          lists: state.backgroundTab.lists.map((item, index) => {
            if (index === action.payload.index) {
              return {
                ...item,
                elements: action.payload.elements,
              };
            }
            return item;
          }),
        },
      };
    case ActionTypesDesigner.SET_STICKERS_TAB:
      return {
        ...state,
        stickerTab: action.payload,
      };
    case ActionTypesDesigner.UPDATE_STICKERS_TAB_CATEGORY:
      return {
        ...state,
        stickerTab: {
          ...state.stickerTab,
          lists: state.stickerTab.lists.map((item, index) => {
            if (index === action.payload.index) {
              return {
                ...item,
                elements: action.payload.elements,
              };
            }
            return item;
          }),
        },
      };
    default:
      return state;
  }
}

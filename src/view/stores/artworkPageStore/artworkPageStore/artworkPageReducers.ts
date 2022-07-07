import { ArtwokrPageConfigType } from '../../../../models/artwork.models';
import ActionTypesCart from '../actionTypes';
import initArtworkPageStore from './artworkPageActions';

const defaultState: ArtwokrPageConfigType = {
  pageAlert: {
    text: '50% Off Business Cards & Tshirts - Use Code: AMAZNG50',
    displayType: 1,
    displayDuration: 120,
  },
  menuItems: [
    {
      text: 'Bag Signs',
      toolTip: 'Select from multiple Bag sign sizes.',
      action: '',
      subMenus: [
        {
          action: 'product/196',
          subMenus: null,
          text: 'Bag Sign 24inx20in',
          toolTip: '2 sided print on poly bag material up to 2 colors',
        },
        {
          action: 'product/195',
          subMenus: null,
          text: 'Bag Sign 32inx24in',
          toolTip: '2 sided print on poly bag material up to 2 colors',
        },
        {
          action: 'product/43',
          subMenus: null,
          text: 'Bag Sign 24inx20in',
          toolTip: '2 sided print on poly bag material up to 2 colors',
        },
        {
          action: 'product/44',
          subMenus: null,
          text: 'Bag Sign 32inx24in',
          toolTip: '2 sided print on poly bag material up to 2 colors',
        },
      ],
    },
  ],
  pageConfig: {
    showSignIn: true,
    showAddToCart: true,
    showFooter: true,
    showHeader: true,
    title: 'ArtWork',
    description: 'See Artwork',
  },
  footer: {
    testimonials: null,
    showCopyrightNotice: true,
    showPrivacyPolicy: true,
    showTermsOfUser: true,
  },
};

export type ArtworkActionType = ReturnType<typeof initArtworkPageStore>;

export function artworkPageReducer(state = defaultState, action: ArtworkActionType) {
  switch (action.type) {
    case ActionTypesCart.INIT_ARTWORK_PAGE_SETUP:
      return state;
    default:
      return state;
  }
}

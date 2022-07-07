import { AlertType, FooterType, PageSetupType, ProductType } from './commonPage.models';

export type HomePageConfigType = {
  pageAlert?: AlertType;
  pageConfig?: PageSetupType;
  bestOffers?: IBestOffers;
  footer?: FooterType;
};

export interface IHomePageInfoType extends HomePageConfigType {
  userPicks?: ProductType[];
  specials?: SpecialItemType[];
  recommended?: ProductType[];
  products?: ProductType[];
}

export type HomePageComponents = 'bestOffers' | 'userPicks' | 'specials' | 'recommended' | 'products';

export type HomePageStateType = {
  isLoaded: boolean;
  order: HomePageComponents[];
  pageConfig?: PageSetupType;
  pageAlert?: AlertType;
  bestOffers?: IBestOffers;
  userPicks?: ProductType[];
  specials?: SpecialItemType[];
  recommended?: ProductType[];
  products?: ProductType[];
  footer?: FooterType;
};

export interface IBestOffers {
  displayDuration: number;
  slides: OfferItemType[];
}

enum TextHAligns {
  Left,
  Center,
  Right,
  LeftCenter,
  RightCenter,
}

enum TextVAligns {
  Top,
  Center,
  Bottom,
}

export type OfferItemType = {
  name: string;
  description: string;
  actionText: string;
  action: string | null;
  textHAlign?: TextHAligns;
  textVAlign?: TextVAligns;
  imageUrl: string;
};

export type SpecialItemType = {
  actionText: string;
  badge: string;
  product: ProductType;
};

export const defaultHomePageSettings = {
  offers: {
    textHAlign: TextHAligns.Center,
    textVAlign: TextVAligns.Center,
    displayTime: 10,
  },
};

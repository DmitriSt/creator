import { IBaseObj } from './commonPage.models';

export type ThemesCardsConfigType = {
  Themes?: ThemeCardType[];
};

export type ThemesStateType = {
  activeTheme: ThemeCardType | null;
  themeSides: ThemeCardSideType[];
  activeThemeSide: ThemeCardSideType | null;
  themes?: ThemeCardType[];
};

export type ThemeSearchStateType = {
  search: IBaseObj | null;
  results: number;
};

export type SearchUpdate = {
  key: string;
  value: string | null;
};

export type ThemeCardType = {
  cardId: string;
  cardType: number;
  description: string;
  name: string;
  previews: ThemeCardSideType[];
  supportedDesigners: IDesignerType;
};

export type ThemeCardSideType = {
  title: CardSide;
  description: string;
  url: string;
};

export enum CardSide {
  Front = 'Front',
  Back = 'Back',
}

export type ThemeTDO = {
  productId: number;
  page: number;
  pageSize: number;
  attributes: string[];
};

export type SearchPagingModel = PagingModel<SearchResponseItem>;

export type PagingModel<T> = {
  matchCount: number;
  page: number;
  pageData: T[];
  pageSize: number;
};

export type SearchResponseItem = {
  cardId: string;
  cardType: number;
  image: SearchResponseItemImage;
};

export type SearchResponseItemImage = {
  description: string;
  height: number;
  isTransparent: boolean;
  isVector: boolean;
  mediumUrl: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  width: number;
};

export interface IDesignerType {}

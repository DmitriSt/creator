import { TestimonialType } from './productPage.models';

export type CommonStateType = {
  menu: MenuItemType[] | null;
  socialLinks: ISocialMediaLink[] | null;
  recommended: ProductType[] | null;
};

export interface ISocialMediaLink {
  name: string;
  link: string;
}

export type PageSetupType = {
  showSignIn: boolean;
  showAddToCart: boolean;
  showFooter: boolean;
  showHeader: boolean;
  title: string;
  description: string;
};

export type ColorSchemeType = {
  TextColor: string;
  MenuColor: string;
};

export enum DisplayTypes {
  ManualClose,
  AutoClose,
  Permanent,
}

export type AlertType = {
  text: string;
  displayType?: DisplayTypes;
  displayDuration?: number;
};

export enum AlertStatus {
  Visible = 'visible',
  Hidden = 'hidden',
}

export type HeaderType = {
  brandingLogo: string;
  brandingText: string;
  message: string;
};

export type MenuItemType = {
  text: string;
  toolTip: string;
  action: string;
  subMenus?: MenuItemType[] | null;
  subElements?: string[];
};

export enum ProductTypes {
  Group,
  Designable,
  Uploadable,
  DesignableUploadable,
  Shelve,
}

export type ImageType = {
  small: string;
  medium: string;
  large: string;
};

export type ProductType = {
  action: string;
  products: ProductType[];
  image: ImageType;
  productId: number;
  name: string;
  recommended: boolean;
  userPick: boolean;
  description: string;
  productType: ProductTypes;
};

export type FooterType = {
  showCopyrightNotice: boolean;
  showPrivacyPolicy: boolean;
  showTermsOfUser: boolean;
  testimonials: TestimonialType[];
};

export const defaultPageSettings = {
  alert: {
    DisplayType: DisplayTypes.ManualClose,
    DisplayTime: 10,
  },
};

export type SelectorType = {
  filter?: ItemType;
  search?: ItemType;
  sorting?: ItemType;
};

export type ItemType = {
  Action: string;
  Name: string;
};

export type ParamsType = {
  id: string;
};

export interface IBaseObj {
  [key: string]: string;
}

export type BaseMap = Map<string, string>;

export interface IExtendedFilterConfigItem extends IFilterConfigItem {
  icon?: string;
}

export interface IFilterConfig {
  defaultValue: string | null;
  description: string;
  items: IFilterConfigItem[];
  text: string;
}

export interface IFilterConfigItem {
  value: string;
  text: string;
}

export type UTCDateInfo = {
  utcDate: string;
  timestamp: number;
  values: UTCDateValues;
};

export type UTCDateValues = {
  utcYear: number;
  utcMonth: number;
  utcMonthDay: number;
  utcHour: number;
  utcMinutes: number;
  utcMiliseconds: number;
};

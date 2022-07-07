import { AlertType, FooterType, IFilterConfig, IFilterConfigItem, PageSetupType } from './commonPage.models';
import { IFilterConfigState } from './productGroupPage.models';

export type ThemesPageConfigType = {
  pageAlert?: AlertType;
  pageConfig?: IThemePageSetup;
  footer?: FooterType;
  filtersConfig?: IFilterConfig[];
};

export type ThemesPageStateType = {
  isLoaded: boolean;
  pageAlert: AlertType | null;
  pageConfig: IThemePageSetup | null;
  footer: FooterType | null;
  filtersConfig: IThemePageFilterConfig | null;
};

export interface IThemePageFilterConfig extends IFilterConfigState {
  search: IFilterConfig | null;
}

export interface IThemePageSetup extends PageSetupType {
  backgroundImage: string;
  searchPageType: ThemesHeaderTypes;
  showBuildYourOwn: boolean;
  showSkipToDesigner: boolean;
}

export enum ThemesHeaderTypes {
  Selector,
  Search,
}

type ThemesHeaderOptions = {
  Filters?: IFilterConfigItem[][];
  Search?: IFilterConfigItem;
  Sorting?: IFilterConfigItem[];
};

type ThemesHeaderType = {
  Title: string;
  Background?: string;
  Type: ThemesHeaderTypes;
  Options: ThemesHeaderOptions;
};

export type ContextValue = {
  search: string;
  setSearch: (search: string) => void;
};

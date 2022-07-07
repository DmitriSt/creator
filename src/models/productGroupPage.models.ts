import {
  AlertType,
  FooterType,
  IFilterConfig,
  MenuItemType,
  PageSetupType,
  ProductType,
  SelectorType,
} from './commonPage.models';

export type ProductGroupPageConfigType = {
  pageAlert?: AlertType;
  pageConfig?: PageSetupType;
  products?: ProductType[];
  footer?: FooterType;
  filtersConfig?: IFilterConfig[];
};

export type ProductGroupPageStateType = {
  isLoaded: boolean;
  selector: SelectorType;
  pageConfig: PageSetupType | null;
  pageAlert: AlertType | null;
  products: ProductType[] | null;
  filtersConfig: IFilterConfigState | null;
  footer: FooterType | null;
};

export interface IFilterConfigState {
  filters: IFilterConfig[];
  sort: IFilterConfig | null;
}

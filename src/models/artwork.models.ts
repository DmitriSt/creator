// eslint-disable-next-line @typescript-eslint/ban-types
import { AlertType, FooterType, IFilterConfig, MenuItemType, PageSetupType } from './commonPage.models';

export type ArtwokrPageConfigType = {
  pageAlert?: AlertType;
  menuItems?: MenuItemType[];
  footer?: FooterType;
  pageConfig: PageSetupType;
};

export type ActiveProductConfigType = {
  filters: IFilterConfig[] | null;
  id: number | null;
  price: number | null;
};

export type ActiveProductDTO = {
  filters: IFilterConfig[] | null;
  id: number;
  price: number | null;
};

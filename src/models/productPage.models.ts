import { AlertType, FooterType, IFilterConfig, ImageType, PageSetupType, ProductTypes } from './commonPage.models';

export interface IProductPageSetup extends PageSetupType {
  showPriceCalculator: boolean;
}

export type ProductPageConfigType = {
  pageAlert?: AlertType;
  pageConfig?: IProductPageSetup;
  details?: ProductItemType;
  footer?: FooterType;
  priceCalculatorConfig?: IFilterConfig[];
};

export type ProductPageStateType = {
  isLoaded: boolean;
  pageConfig: IProductPageSetup | null;
  pageAlert: AlertType | null;
  details: ProductItemType | null;
  footer: FooterType | null;
  priceCalculatorConfig: IFilterConfig[] | null;
};

type ProductItemType = {
  action: string | null;
  images: ImageType[];
  features: FeatureType[];
  productId: number;
  name: string;
  description: string;
  productType: ProductTypes;
};

export type FeatureType = {
  icon: string;
  text: string;
  description: string;
};

export type TestimonialType = {
  author: string;
  city: string;
  jobTitle: string;
  pictureUrl: string;
  text: string;
};

export const defaultProductPageSettings = {
  recommended: {
    count: 4,
  },
  testimonials: {
    count: 3,
  },
};

export interface IProductPriceDTO {
  productId: number;
  attributes: string[];
}

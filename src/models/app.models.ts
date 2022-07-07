import { TestimonialType } from './productPage.models';

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppConfigType = {
  brandingLogo: string;
  brandingText: string;
  copyrightNotice: string;
  customerServiceInfo: ICustomerServiceInfo;
  measurementUnits: MeasurementUnits;
  campaignConfig: CouponCampaign;
  message: string;
  siteId: number;
  typography: IAppTypography;
  uiCulture: string;
  waterarkText: string;
};

export interface IAppConfigTypeStore {
  brandingLogo: string;
  brandingText: string;
  campaignConfig: CouponCampaign | null;
  copyrightNotice: string;
  customerServiceInfo: ICustomerServiceInfo | null;
  measurementUnits: MeasurementUnits | null;
  siteId: number | null;
  message: string;
  supportToolsScript: ISupportToolScript[] | null;
  typography: IAppTypography | null;
  uiCulture: string;
  waterarkText: string;
}

export type CouponCampaign = {
  isRunning: boolean;
  message: string | null;
  name: string | null;
};

export interface ISupportToolScript {
  name: string;
  scriptTemplate: string;
}

export interface ICustomerServiceInfo {
  phone: string;
  email: string;
}

export interface IAppTypography {
  textColor: string;
  menuColor: string;
}

export interface MeasurementUnits {
  length: string;
  weight: string;
}

export type AppStateType = {
  isLoaded: boolean;
  config: IAppConfigTypeStore;
  testimonials: TestimonialType[];
};

export enum CookiesNames {
  AlertStatus = 'ePrintCreator_Alert_Status',
}

export type AppSetupType = {
  baseUrl: string;
  apiRoot: string;
};

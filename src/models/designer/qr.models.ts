import { TextTypes } from '../constants/designer';

export enum FormatTypes {
  MeCard = 'MeCard',
  VCard = 'VCard',
  Email = 'Email',
  Phone = 'Phone',
  URL = 'URL',
  Text = 'Text',
}

export type MeCardType = {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
};

export type VCardType = {
  title?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
};

export type TextType = {
  text?: string;
};

export type EmailType = {
  email?: string;
};

export interface IQRElementValue {
  [FormatTypes.MeCard]: QRValueTextTypeMap;
  [FormatTypes.VCard]: QRValueTextTypeMap;
  [FormatTypes.Email]: QRValueTextTypeMap;
  [FormatTypes.Phone]: QRValueTextTypeMap;
}

// export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type MaintainedQRFormats = FormatTypes.MeCard | FormatTypes.VCard | FormatTypes.Email | FormatTypes.Phone;

export type QRValueTextTypeMap = Record<string, TextTypes | TextTypes[] | null>; // { [k in keyof T]: null | TextTypes | TextTypes[] };
// export type QRMeCardValueTextTypeMap = QRValueTextTypeMap<MeCardType>;
// export type QRVCardValueTextTypeMap = QRValueTextTypeMap<VCardType>;
// export type QRTextTypeMap = QRValueTextTypeMap<TextType>;
// export type QRCardValueTextTypeMap = QRMeCardValueTextTypeMap | QRVCardValueTextTypeMap | QRTextTypeMap;

import { IFilterConfigItem } from '../commonPage.models';
import { FormatTypes, IQRElementValue } from '../designer/qr.models';

export enum Axes {
  Horizontal,
  Vertical,
}

export enum ElementStatuses {
  Stable,
  Moving,
  Rotating,
  Resizing,
  CroppingMode,
  Cropping,
  TextEditing,
}

export const grabbingStatuses = [
  ElementStatuses.Moving,
  ElementStatuses.Rotating,
  ElementStatuses.Resizing,
  ElementStatuses.Cropping,
];

export enum ElementFeatures {
  Movable,
  Flippable,
  Croppable,
  Rotatable,
  Filterable,
  Colorable,
  Textable,
  UsableAsImage,
  UsableAsBackground,
}

export enum ElementTypes {
  Template = 'Template',
  Layout = 'Layout',
  Image = 'Image',
  BackgroundImage = 'BackgroundImage',
  BackgroundColor = 'BackgroundColor',
  Clipart = 'Clipart',
  QR = 'QR',
  Text = 'Text',
}

export enum Aligns {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
  Center = 'Center',
  LeftTop = 'Left Top',
  RightTop = 'Right Top',
  LeftBottom = 'Left Bottom',
  RightBottom = 'Right Bottom',
}

export const defaultColorPresets = ['#FFEE11', '#CA12E2', '#4AED99', '#003550', '#51EA1A', '#DA567A', '#ED993f'];

export type TextAligns = Aligns.Left | Aligns.Center | Aligns.Right;

export enum TextStyles {
  Bold = 'bold',
  Italic = 'italic',
  Underline = 'underline',
}

export type TextFontStyles = {
  color: string;
  fontFamily: string;
  fontSize: number;
};

export type TextViewStyles = {
  tags: TextStyles[];
  styles: TextFontStyles;
};

export const availableFonts = [
  'AlegreyaSC',
  'Amaranth',
  'ApcReverse',
  'Asap',
  'Cabin',
  'IstokWeb',
  'JosefinSans',
  'JuliusSansOne',
  'LobsterTwo',
  'Lora',
  'Merriweather',
  'MerriweatherSans',
  'NewsCycle',
  'OpenSans',
  'PassionOne',
  'PTSansWeb',
  'Roboto',
  'RobotoSlab',
  'RobotoSlabLight',
] as const;

export const availableFontVariants = {
  AlegreyaSC: ['normal', 'bold', 'italic', 'bold-italic'],
  Amaranth: ['normal', 'bold', 'italic', 'bold-italic'],
  ApcReverse: ['normal', 'bold', 'italic'],
  Asap: ['normal', 'bold', 'italic', 'bold-italic'],
  Cabin: ['normal', 'bold', 'italic', 'bold-italic'],
  IstokWeb: ['normal', 'bold', 'italic', 'bold-italic'],
  JosefinSans: ['normal', 'bold', 'italic', 'bold-italic'],
  JuliusSansOne: ['normal'],
  LobsterTwo: ['normal', 'bold', 'italic', 'bold-italic'],
  Lora: ['normal', 'bold', 'italic', 'bold-italic'],
  Merriweather: ['normal', 'bold', 'italic', 'bold-italic'],
  MerriweatherSans: ['normal', 'bold', 'italic', 'bold-italic'],
  NewsCycle: ['normal', 'bold'],
  OpenSans: ['normal', 'bold', 'italic', 'bold-italic'],
  PassionOne: ['normal', 'bold'],
  PTSansWeb: ['normal', 'bold', 'italic', 'bold-italic'],
  Roboto: ['normal', 'bold', 'italic', 'bold-italic'],
  RobotoSlab: ['normal', 'bold'],
  RobotoSlabLight: ['normal', 'bold'],
} as const;

export type TextFontType = typeof availableFonts extends readonly (infer U)[] ? U : never;

export enum TextTypes {
  None = 'None',
  Name = 'Name',
  Title = 'Title',
  HomeTelephone = 'HomeTelephone',
  MobileTelephone = 'MobileTelephone',
  FaxNumber = 'FaxNumber',
  EmailAddress = 'EmailAddress',
  WebAddress = 'WebAddress',
  HomeAddress = 'HomeAddress',
  HomeAddress2 = 'HomeAddress2',
  City = 'City',
  CityState = 'CityState',
  PostalCode = 'PostalCode',
  Country = 'Country',
  CompanyName = 'CompanyName',
  CompanySlogan = 'CompanySlogan',
  Department = 'Department',
  OfficeTelephone = 'OfficeTelephone',
  OfficeAddress = 'OfficeAddress',
  OfficeCity = 'OfficeCity',
  OfficePostalCode = 'OfficePostalCode',
  OfficeCountry = 'OfficeCountry',
  Facebook = 'Facebook',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  Pinterest = 'Pinterest',
  Tiktok = 'Tiktok',
}

export const QRElementValue: IQRElementValue = {
  [FormatTypes.MeCard]: {
    firstName: TextTypes.Name,
    // lastName: null,
    address1: [TextTypes.HomeAddress, TextTypes.OfficeAddress],
    // address2: null,
    city: [TextTypes.City, TextTypes.OfficeCity],
    postalCode: [TextTypes.PostalCode, TextTypes.OfficePostalCode],
    // state: null,
    country: [TextTypes.Country, TextTypes.OfficeCountry],
    phone: [TextTypes.MobileTelephone, TextTypes.OfficeTelephone],
    email: TextTypes.EmailAddress,
  },
  [FormatTypes.VCard]: {
    title: TextTypes.Title,
    company: TextTypes.CompanyName,
    firstName: TextTypes.Name,
    // lastName: null,
    address1: [TextTypes.HomeAddress, TextTypes.OfficeAddress],
    // address2: null,
    city: [TextTypes.City, TextTypes.OfficeCity],
    postalCode: [TextTypes.PostalCode, TextTypes.OfficePostalCode],
    // state: null,
    country: [TextTypes.Country, TextTypes.OfficeCountry],
    phone: [TextTypes.MobileTelephone, TextTypes.OfficeTelephone],
    email: TextTypes.EmailAddress,
    website: TextTypes.WebAddress,
  },
  [FormatTypes.Email]: {
    email: TextTypes.EmailAddress,
  },
  [FormatTypes.Phone]: {
    text: [TextTypes.MobileTelephone, TextTypes.OfficeTelephone],
  },
};

export const percents: IFilterConfigItem[] = [
  {
    value: '300',
    text: '300%',
  },
  {
    value: '250',
    text: '250%',
  },
  {
    value: '200',
    text: '200%',
  },
  {
    value: '190',
    text: '190%',
  },
  {
    value: '180',
    text: '180%',
  },
  {
    value: '170',
    text: '170%',
  },
  {
    value: '160',
    text: '160%',
  },
  {
    value: '150',
    text: '150%',
  },
  {
    value: '140',
    text: '140%',
  },
  {
    value: '130',
    text: '130%',
  },
  {
    value: '120',
    text: '120%',
  },
  {
    value: '110',
    text: '110%',
  },
  {
    value: '100',
    text: '100%',
  },
  {
    value: '90',
    text: '90%',
  },
  {
    value: '80',
    text: '80%',
  },
  {
    value: '70',
    text: '70%',
  },
  {
    value: '60',
    text: '60%',
  },
  {
    value: '50',
    text: '50%',
  },
];

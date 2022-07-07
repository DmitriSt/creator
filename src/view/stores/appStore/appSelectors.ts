import { HeaderType } from '../../../models/commonPage.models';
import { RootStateType } from '../store';

const isHeaderInfo = (state: RootStateType): HeaderType | null => {
  const {
    appState: { config },
  } = state;
  const isHeader = config.brandingLogo && config.brandingText && config.message;
  return isHeader
    ? {
        brandingLogo: config.brandingLogo,
        brandingText: config.brandingText,
        message: config.message,
      }
    : null;
};

export default isHeaderInfo;

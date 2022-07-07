import { ColorSchemeType } from '../../../models/commonPage.models';
import { RootStateType } from '../store';

const setupConfig = (state: RootStateType) => {
  const {
    appState: { config },
    homePageState: { pageConfig },
  } = state;
  const colorSchema: ColorSchemeType = {
    TextColor: config.typography?.textColor || '',
    MenuColor: config.typography?.menuColor || '',
  };
  if (pageConfig) {
    return {
      ...pageConfig,
      colorScheme: colorSchema,
    };
  }
  return null;
};

export default setupConfig;

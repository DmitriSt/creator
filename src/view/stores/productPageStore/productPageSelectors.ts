import { RootStateType } from '../store';

const getPageConfig = (state: RootStateType) => {
  return state.productPageState.pageConfig ? state.productPageState.pageConfig : null;
};

export default getPageConfig;

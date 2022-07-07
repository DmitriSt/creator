import { getBaseSearch } from '../../services/designer/designerTabs.service';
import {
  IBaseSearchResult,
  ILoadMap,
  ITabbarList,
  ITabbarListElement,
  ITabCategoryDTO,
} from '../interfaces/interfaces';

export async function getCategories(search: string, productId: number, page: number, count: number) {
  const response = await getBaseSearch<ITabCategoryDTO>(search, productId, page, count);
  const lists: IBaseSearchResult<ITabbarList> = {
    count: response.matchCount,
    lists: [],
  };
  for (let i = 0; i < response.pageData.length; i++) {
    lists.lists.push(response.pageData[i].category);
  }
  return lists;
}

export async function getCategoryElements(url: string, productId: number, page: number, pageSize: number) {
  const response = await getBaseSearch<ITabbarListElement>(url, productId, page, pageSize);
  return response.pageData;
}

class TabLoadManager {
  private categories: ILoadMap = {};
  private tabs: ILoadMap = {};

  private setDefaultTabState(key: string) {
    this.tabs[key] = {
      loaded: false,
      loading: false,
      error: false,
    };
  }

  private setDefaultCategoryState(key: string) {
    this.categories[key] = {
      loaded: false,
      loading: false,
      error: false,
    };
  }

  addCategory(key: string, tabId: string) {
    const keyId = `${tabId}_${key}`;
    if (typeof this.categories[keyId] === 'boolean') return;
    this.setDefaultCategoryState(keyId);
    this.categories[keyId].loading = true;
    this.categories[keyId].loaded = false;
    this.categories[keyId].error = false;
  }
  updateCategory(key: string, tabId: string, loading: boolean, loaded = true, error = false) {
    const keyId = `${tabId}_${key}`;
    this.categories[keyId].loading = loading;
    this.categories[keyId].loaded = loaded;
    this.categories[keyId].error = error;
  }
  getCategoryState(key: string, tabId: string) {
    const keyId = `${tabId}_${key}`;
    return this.categories[keyId];
  }

  addTab(tab: string) {
    if (typeof this.tabs[tab] === 'boolean') return;
    this.setDefaultTabState(tab);
    this.tabs[tab].loading = true;
    this.tabs[tab].loaded = false;
    this.tabs[tab].error = false;
  }
  updateTab(tab: string, loading: boolean, loaded = true, error = false) {
    this.tabs[tab].loading = loading;
    this.tabs[tab].loaded = loaded;
    this.tabs[tab].error = error;
  }
  getTabState(tab: string) {
    return this.tabs[tab];
  }
}

const TabLoader = new TabLoadManager();

export default TabLoader;

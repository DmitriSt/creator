import { getSearchTemplatesConfig, getTabTemplatesConfig } from '../../services/designer/designerTabs.service';
import { ITabApi, ITabbarListElementImage } from '../interfaces/interfaces';

// todo fix all possible wrong responses (or nullable)

export async function getTemplatesTab(urls: ITabApi, productId: number, page: number, count: number) {
  const response = await getTabTemplatesConfig(urls, productId, page, count);
  const listArray: ITabbarListElementImage[] = [];
  const lists = {
    count: response.matchCount,
    lists: listArray,
  };

  if (!response.pageData) {
    return {
      count: 0,
      lists: [],
    };
  }

  for (let i = 0; i < response.pageData.length; i++) {
    lists.lists.push(response.pageData[i].image);
  }

  return lists;
}

export async function getSearchTemplates(urls: ITabApi, page: number, count: number, value: string) {
  const response = await getSearchTemplatesConfig(urls, 1, page, count, value);
  const listArray: unknown[] = [];
  const lists = {
    count: response.matchCount,
    lists: listArray,
  };
  for (let i = 0; i < response.pageData.length; i++) {
    lists.lists.push(response.pageData[i].image);
  }
  return lists;
}

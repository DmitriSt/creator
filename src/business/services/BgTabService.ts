import { getSearchBGConfig } from '../../services/designer/designerTabs.service';
import { ITabApi } from '../interfaces/interfaces';

export default async function getSearchBackgrounds(
  urls: ITabApi,
  productId: number,
  page: number,
  count: number,
  value: string
) {
  const response = await getSearchBGConfig(urls, productId, page, count, value);
  const test: unknown[] = [];
  const lists = {
    count: response.matchCount,
    lists: [
      {
        name: 'Results',
        elements: test,
      },
    ],
  };
  for (let i = 0; i < response.pageData.length; i++) {
    lists.lists[0].elements.push(response.pageData[i]);
  }

  return lists;
}

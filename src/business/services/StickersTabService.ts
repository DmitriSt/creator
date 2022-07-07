import { getSearchStickersConfig } from '../../services/designer/designerTabs.service';
import { ITabApi, ITabbarListElement } from '../interfaces/interfaces';

export default async function getSearchStickers(
  urls: ITabApi,
  productId: number,
  page: number,
  count: number,
  value: string
) {
  const response = await getSearchStickersConfig(urls, productId, page, count, value);
  const listArray: ITabbarListElement[] = [];
  const lists = {
    count: response.matchCount,
    lists: [
      {
        name: 'Results',
        elements: listArray,
      },
    ],
  };
  for (let i = 0; i < response.pageData.length; i++) {
    lists.lists[0].elements.push(response.pageData[i]);
  }

  return lists;
}

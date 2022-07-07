import { getTabPersonalImagesConfig } from '../../services/designer/designerTabs.service';
import { ITabbarListElement } from '../interfaces/interfaces';

export default async function getPersonalImagesTab(designId: string, productId: number, page: number, count: number) {
  const response = await getTabPersonalImagesConfig(designId, productId, page, count);
  const listArray: ITabbarListElement[] = [];
  const lists = {
    count: response.matchCount,
    lists: [
      {
        elements: listArray,
      },
    ],
  };
  if (response.pageData.length) {
    for (let i = 0; i < response.pageData.length; i++) {
      lists.lists[0].elements.push(response.pageData[i]);
    }
  }
  return lists;
}

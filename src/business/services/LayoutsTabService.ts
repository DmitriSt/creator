import axios from 'axios';

import { getTabLayoutsConfig } from '../../services/designer/designerTabs.service';
import { ITabApi } from '../interfaces/interfaces';

interface ITabbarLayoutJsonItems {
  align?: string;
  color: string;
  fontFamily?: string;
  fontSize?: number;
  height?: number;
  left?: number;
  manuallyResized?: boolean;
  placeholder?: boolean;
  rotation?: number;
  text?: string;
  textType?: string;
  top?: number;
  type: string;
  width?: number;
}

interface ITabbarLayoutJson {
  height: number;
  items: ITabbarLayoutJsonItems[];
  layoutId: string;
  name: string;
  width: number;
}

interface ITabbarLayoutList {
  $type: string;
  cardId: string;
  cardType: number;
  dataApi: string;
  json: ITabbarLayoutJson;
  url: string;
}

export default async function getLayoutsTab(urls: ITabApi, productId: number, page: number, count: number) {
  const response = await getTabLayoutsConfig(urls, productId, page, count);
  const listArray: ITabbarLayoutList[] = [];
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
    lists.lists.push(response.pageData[i]);
  }

  /* eslint-disable no-await-in-loop */
  for (let j = 0; j < lists.lists.length; j++) {
    const json = (await axios.get(lists.lists[j].dataApi)).data;
    lists.lists[j].json = json;
  }
  /* eslint-disable no-await-in-loop */

  return lists;
}

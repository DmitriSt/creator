import _ from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { ICategoryUpdate, ITabbarList } from '../../../../business/interfaces/interfaces';
import TabLoader, { getCategories, getCategoryElements } from '../../../../business/services/CategoryService';
import getLayoutsTab from '../../../../business/services/LayoutsTabService';
import getPersonalImagesTab from '../../../../business/services/PersonalImagesService';
import { getTemplatesTab } from '../../../../business/services/TemplatesTabService';
import { TabSettings, TabTools } from '../../../../models/designer/tabBar.models';
import {
  initTabBarStore,
  setBackgroundsTab,
  setImagesTab,
  setLayoutsTab,
  setStickersTab,
  setTemplateTab,
  setUserImagesTab,
  updateBgTabCategory,
  updateImagesTabCategory,
  updateStickersTabCategory,
} from '../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../stores/store';
import Panel from './Panel/Panel';
import Tab from './Tab/Tab';
import styles from './tabBar.module.scss';

interface ITabbarProps {
  isShowPreview: boolean;
}

const TabBar = ({ isShowPreview }: ITabbarProps) => {
  const dispatch = useDispatch();

  const showingTabs = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.showingTabs);
  const order = useSelector((state: RootStateType) => state.designerState.tabBar.order);
  const isStickers = useSelector((state: RootStateType) => state.designerState.tabBar.stickerTab?.lists.length);
  const isBgs = useSelector((state: RootStateType) => state.designerState.tabBar.backgroundTab?.lists.length);
  const isImages = useSelector((state: RootStateType) => state.designerState.tabBar.imagesTab?.lists.length);

  const apiUrlsTemp = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.designTemplates);
  const apiUrlsLayouts = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.textLayouts);
  const apiUrlsImages = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.images);
  const apiUrlsBGs = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.backgrounds);
  const apiUrlsStickers = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.clipArts);

  const designId = useSelector((state: RootStateType) => state.designerState.designer.instance.designId);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);

  useEffect(() => {
    const tools = Object.values(TabTools);
    const availableTabs = tools.filter((tab: string) => showingTabs?.indexOf(tab) !== -1);
    dispatch(initTabBarStore(availableTabs));

    sessionStorage.removeItem('templatesScrollY');
    sessionStorage.removeItem('layoutsScrollY');
    sessionStorage.removeItem('imagesScrollY');
    sessionStorage.removeItem('catalogScrollY');
    sessionStorage.removeItem('bgScrollY');
    sessionStorage.removeItem('stickersScrollY');

    const updateCategoryStatus = (key: string, id: string) => {
      TabLoader.updateCategory(key, id, false);
    };

    const updateImageTabCategory = (dto: ICategoryUpdate, key: string, id: string) => {
      dispatch(updateImagesTabCategory(dto));
      updateCategoryStatus(key, id);
    };

    const updateStickerTabCategory = (dto: ICategoryUpdate, key: string, id: string) => {
      dispatch(updateStickersTabCategory(dto));
      updateCategoryStatus(key, id);
    };

    const updateBGTabCategory = (dto: ICategoryUpdate, key: string, id: string) => {
      dispatch(updateBgTabCategory(dto));
      updateCategoryStatus(key, id);
    };

    const downloadElements = async (
      list: ITabbarList[],
      handler: (dto: ICategoryUpdate, key: string, id: string) => void,
      id: string
    ) => {
      const promiseList = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        TabLoader.addCategory(item.imageSearch, id);
        promiseList.push(getCategoryElements(item.imageSearch, productId, 0, 6));
      }
      const response = await Promise.all(promiseList);
      for (let i = 0; i < response.length; i++) {
        handler(
          {
            index: i,
            elements: response[i],
          },
          list[i].imageSearch,
          id
        );
      }
    };

    if (showingTabs.indexOf('Templates') !== -1) {
      (async () => {
        const data = await getTemplatesTab(apiUrlsTemp, productId, 0, 10);
        dispatch(setTemplateTab({ count: data.count, lists: data.lists, startPage: 0 }));
      })();
    }

    if (showingTabs.indexOf(TabTools.Layouts) !== -1) {
      (async () => {
        const data = await getLayoutsTab(apiUrlsLayouts, productId, 0, 10);
        dispatch(setLayoutsTab({ count: data.count, lists: data.lists, startPage: 0 }));
      })();
    }

    (async () => {
      const data = await getPersonalImagesTab(designId, productId, 0, 10);
      if (data.count) {
        dispatch(
          setUserImagesTab({ count: data.count, lists: [{ elements: [...data.lists[0].elements] }], startPage: 0 })
        );
      }
    })();

    if (showingTabs.indexOf(TabTools.Images) !== -1 && !isImages) {
      (async () => {
        const loadState = TabLoader.getTabState(TabTools.Images);
        if (!loadState || (!loadState.loading && !loadState.loaded)) {
          TabLoader.addTab(TabTools.Images);
          const data = await getCategories(apiUrlsImages.categories, productId, 0, 10);
          dispatch(setImagesTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Images, false);
          await downloadElements(data.lists, updateImageTabCategory, TabTools.Images);
        }
      })();
    }

    if (showingTabs.indexOf(TabTools.Backgrounds) !== -1 && !isBgs) {
      (async () => {
        const loadState = TabLoader.getTabState(TabTools.Backgrounds);
        if (!loadState || (!loadState.loading && !loadState.loaded)) {
          TabLoader.addTab(TabTools.Backgrounds);
          const data = await getCategories(apiUrlsBGs.categories, productId, 0, 20);
          dispatch(setBackgroundsTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Backgrounds, false);
          await downloadElements(data.lists, updateBGTabCategory, TabTools.Backgrounds);
        }
      })();
    }

    if (showingTabs.indexOf(TabTools.Clipart) !== -1 && !isStickers) {
      (async () => {
        const loadState = TabLoader.getTabState(TabTools.Clipart);
        if (!loadState || (!loadState.loading && !loadState.loaded)) {
          TabLoader.addTab(TabTools.Clipart);
          const data = await getCategories(apiUrlsStickers.categories, productId, 0, 20);
          dispatch(setStickersTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Clipart, false);
          await downloadElements(data.lists, updateStickerTabCategory, TabTools.Clipart);
        }
      })();
    }
  }, []);

  return (
    <section className={styles.tabBar} style={{ display: isShowPreview ? 'none' : 'flex' }}>
      <div className={styles.tabs}>
        <div className={styles.tools}>
          {order.map((tab) => (
            <Tab key={uniqid()} tab={tab} />
          ))}
        </div>
        <div className={styles.settings}>
          {Object.values(TabSettings).map((tab) => (
            <Tab key={uniqid()} tab={tab} />
          ))}
        </div>
      </div>
      <Panel />
    </section>
  );
};

export default TabBar;

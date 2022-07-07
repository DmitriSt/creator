import React, { useEffect, useState } from 'react';
import uniqid from 'uniqid';

import { ICategoryUpdate, ITabbarList } from '../../../../../../../business/interfaces/interfaces';
import TabLoader, { getCategoryElements } from '../../../../../../../business/services/CategoryService';
import consts from '../../../../../../../models/constants/consts';
import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import { ReactComponent as IconArrow } from '../../../../../../assets/images/arrowRight.svg';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import stylesTabbar from '../../../tabBar.module.scss';
import BGTabElement from '../../elements/TabElement/BGTabElement';
import ImageTabElement from '../../elements/TabElement/ImageTabElement';
import LayoutTabElement from '../../elements/TabElement/LayoutTabElement';
import StickerTabElement from '../../elements/TabElement/StickerTabElement';
import styles from './tabLists.module.scss';

interface IListsProps {
  lists: any;
  index: number;
  type: string;
  preview?: boolean;
  actionItem?: (index: number, type?: string) => void;
  columns: string;
  updateList?: (dto: ICategoryUpdate) => void;
  productId?: number;
  favourites?: boolean;
}

const TabLists = ({
  lists,
  index,
  type,
  preview,
  actionItem,
  favourites,
  columns,
  updateList,
  productId,
}: IListsProps) => {
  const [loading, setLoading] = useState(false);
  const chooseList = (index: number) => {
    actionItem(index);
  };

  useEffect(() => {
    if (lists.elements) {
      setLoading(false);
    }
  }, [lists]);

  useEffect(() => {
    async function getElements() {
      if (lists.imageSearch && !lists.elements && productId) {
        const state = TabLoader.getCategoryState(lists.imageSearch, type);
        if (state && state.loading) {
          setLoading(true);
        }
        if (updateList && (!state || !state.loading)) {
          setLoading(true);
          const data = await getCategoryElements(lists.imageSearch, productId, 0, 6);
          updateList({ elements: data, index });
          setLoading(false);
        }
      }
    }
    getElements();
  }, []);

  return (
    <div key={uniqid()} className={lists.elements ? stylesTabbar.tabBarSection : ''}>
      {preview ? (
        <div className={styles.listsHeader}>
          <span className={styles.title}>
            {lists.name}
            {favourites && lists.elements.length <= consts.previews.MAX_ELEMENTS_COUNT
              ? ` (${lists.elements.length})`
              : ''}
          </span>
          {lists.imageCount > consts.previews.MAX_ELEMENTS_COUNT ? (
            <span onClick={() => chooseList(index)}>
              {`+ ${lists.imageCount - consts.previews.MAX_ELEMENTS_COUNT}`}
              <IconArrow />
            </span>
          ) : (
            <span>
              <IconArrow style={{ transform: 'rotate(90deg)' }} />
            </span>
          )}
        </div>
      ) : null}

      <div
        className={`${styles.listsElements} ${styles[columns]} ${loading ? styles[`loading_${columns}`] : undefined}`}
      >
        {loading && (
          <div className={styles.loader_wrapper}>
            <Loader isLocal isSmall />
          </div>
        )}
        {lists.elements &&
          lists.elements.map((element: any, i: number) => {
            if (favourites && preview && i >= consts.previews.MAX_ELEMENTS_COUNT) return null;
            switch (type) {
              case TabTools.Layouts:
                return <LayoutTabElement key={uniqid()} element={element} favourites={favourites} />;
              case TabTools.Backgrounds:
                return <BGTabElement key={uniqid()} element={element} favourites={favourites} />;
              case TabTools.Images:
                return <ImageTabElement key={uniqid()} element={element} favourites={favourites} />;
              case TabTools.Clipart:
                return <StickerTabElement key={uniqid()} element={element} favourites={favourites} />;

              default:
                return null;
            }
          })}
      </div>
    </div>
  );
};

const memoizedTabList = React.memo(TabLists);

export default memoizedTabList;

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import getLayoutsTab from '../../../../../../../business/services/LayoutsTabService';
import { setLayoutsTab } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import styles from '../../../tabBar.module.scss';
import LayoutTabElement from '../../elements/TabElement/LayoutTabElement';

const LayoutsTab = () => {
  const dispatch = useDispatch();

  const layoutTab = useSelector((state: RootStateType) => state.designerState.tabBar.layoutTab);
  const apiUrls = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.textLayouts);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);

  const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const newCategories = 10;

  useEffect(() => {
    if (layoutTab && layoutTab.lists.length) {
      setCount(layoutTab.count);
      setLists(layoutTab.lists);
      setStartPage(layoutTab.startPage);
    } else {
      setLoading(true);
      if (apiUrls) {
        (async () => {
          const data = await getLayoutsTab(apiUrls, productId, startPage, newCategories);
          setCount(data.count);
          setLists(data.lists);
          dispatch(setLayoutsTab({ count: data.count, lists: data.lists, startPage: 0 }));
          setLoading(false);
        })();
      }
    }
  }, [apiUrls]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('layoutsScrollY'));
    }
  });

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('templatesScrollY') - 1);
    (async () => {
      const page = layoutTab && layoutTab.startPage ? layoutTab.startPage : startPage;
      async function loadNewStickers() {
        const data = await getLayoutsTab(apiUrls, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newStickers = await loadNewStickers();
      setLists([...lists, ...newStickers]);
      dispatch(setLayoutsTab({ count, lists: [...lists, ...newStickers], startPage: page + 1 }));
    })();

    return Promise.resolve();
  }

  const myImgScroll = document.getElementById('catalogLayouts');
  let startHeight = 0;

  if (myImgScroll) {
    startHeight = myImgScroll.getBoundingClientRect().top;
  }

  const showLoader = () => {
    return (
      <div className={styles.bottomLoaderWrap}>
        <Loader isLocal isSmall />
      </div>
    );
  };

  const onScrollFunc = () => {
    const el = document.querySelector('.infinite-scroll-component');
    sessionStorage.setItem('layoutsScrollY', `${el.scrollTop}`);
  };

  return (
    <>
      {loading && <Loader />}

      <div
        id='catalogLayouts'
        style={{
          height: `${window.innerHeight - startHeight}px`,
        }}
      >
        <InfiniteScroll
          dataLength={lists.length}
          className={styles.scroll}
          height={window.innerHeight - startHeight}
          next={loadMoreRows}
          loader={showLoader()}
          hasMore={lists.length !== count && !!lists.length}
          onScroll={onScrollFunc}
        >
          {lists.map((list) => (
            <LayoutTabElement key={uniqid()} element={list} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default LayoutsTab;

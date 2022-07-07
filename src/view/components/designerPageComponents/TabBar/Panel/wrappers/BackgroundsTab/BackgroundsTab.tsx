import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';

import { ICategoryUpdate, ITabbarList } from '../../../../../../../business/interfaces/interfaces';
import getSearchBackgrounds from '../../../../../../../business/services/BgTabService';
import TabLoader, { getCategories } from '../../../../../../../business/services/CategoryService';
import { BackgroundType } from '../../../../../../../models/designer/designer.models';
import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import { ReactComponent as IconArrow } from '../../../../../../assets/images/arrowRight.svg';
import { setBackgroundsTab, updateBgTabCategory } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import Search from '../../../../../sharedComponents/Search/Search';
import styles from '../../../tabBar.module.scss';
import Overlay from '../../shared/Overlay/Overlay';
import SearchList from '../../shared/SearchList/SearchList';
import TabCategory from '../../shared/TabCategory/TabCategory';
import TabColors from '../../shared/TabColors/TabColors';
import TabLists from '../../shared/TabLists/TabLists';

const colorsConsts = ['#000000', '#FFFFFF', '#E8E4C6', '#C6E2E8', '#F5E3D2'];

const BackgroundsTab = () => {
  const dispatch = useDispatch();

  const backgroundTab = useSelector((state: RootStateType) => state.designerState.tabBar.backgroundTab);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);
  const apiUrls = useSelector((state: RootStateType) => state.designerState.designer.mainConfig.backgrounds);

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const isBgTransparent = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions.isTransparent
  );
  const bgList = useSelector((state: RootStateType) => state.designerState.tabBar.backgroundTab?.lists);
  const bgType = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions.type
  );

  const [lists, setLists] = useState<ITabbarList[]>([]);
  const [searchList, setSearchList] = useState([]);
  const [count, setCount] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [preview, setPreview] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [searchWithoutResults, setSearchWithoutResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const listHeight = 180;
  const newCategories = 20;

  const isFound = useRef(false);

  useEffect(() => {
    if (bgList) {
      setLists(bgList);
      setLoading(false);
    }
  }, [bgList]);

  useEffect(() => {
    if (backgroundTab && backgroundTab.lists.length) {
      setCount(backgroundTab.count);
      setLists(backgroundTab.lists);
      setStartPage(backgroundTab.startPage);
    } else {
      const loadState = TabLoader.getTabState(TabTools.Backgrounds);
      if (loadState && loadState.loading) {
        setLoading(true);
      }
      if (apiUrls && (!loadState || (!loadState.loading && !loadState.loaded))) {
        (async () => {
          setLoading(true);
          TabLoader.addTab(TabTools.Backgrounds);
          const data = await getCategories(apiUrls.categories, productId, startPage, newCategories);
          setCount(data.count);
          setLists(data.lists);
          dispatch(setBackgroundsTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Backgrounds, true);
          setLoading(false);
        })();
      }
    }
  }, [apiUrls]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('bgScrollY'));
    }
  });

  const chooseList = useCallback((index: number) => {
    setPreview(false);
    setActiveIndex(index);
  }, []);

  const returnLists = () => {
    setPreview(true);
    setActiveIndex(null);
  };

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('bgScrollY') - 1);
    (async () => {
      const page = backgroundTab && backgroundTab.startPage ? backgroundTab.startPage : startPage;
      async function loadNewBGs() {
        const data = await getCategories(apiUrls.categories, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newBg = await loadNewBGs();
      if (!isSearch) {
        setLists([...lists, ...newBg]);
        dispatch(setBackgroundsTab({ count, lists: [...lists, ...newBg], startPage: page + 1 }));
      }
    })();

    return Promise.resolve();
  }

  const updateList = useCallback((dto: ICategoryUpdate, id: string) => {
    dispatch(updateBgTabCategory(dto));
  }, []);

  const searchCallback = useCallback(
    (value: string) => {
      if (!isFound.current) {
        setSearchValue(value);
        (async () => {
          if (apiUrls) {
            setSearch(true);
            const searchData = await getSearchBackgrounds(apiUrls, productId, startPage, 100, value);
            if (searchData.lists.length) {
              setSearchWithoutResults(false);
              setSearchList(searchData.lists);
            } else {
              setSearchWithoutResults(true);
              isFound.current = true;
            }
          }
        })();
      }
    },
    [apiUrls]
  );

  const searchCloseCallback = () => {
    if (backgroundTab && backgroundTab.lists.length) {
      setSearch(false);
      setSearchWithoutResults(false);
    }
  };

  const debounced = debounce((value: string) => {
    if (value.length >= 3) searchCallback(value);
  }, 1000);

  const searchChange = (text: string): void => {
    isFound.current = false;
    if (text.length === 0) {
      setSearch(false);
      setSearchWithoutResults(false);
      isFound.current = true;
    } else {
      debounced(text);
    }
  };

  const myImgScroll = document.getElementById('catalogBGs');
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
    sessionStorage.setItem('bgScrollY', `${el.scrollTop}`);
  };

  const disableOverlay = useMemo(
    () => isBgTransparent && <Overlay title='Backgrounds are not available for chosen canvas' />,
    [isBgTransparent]
  );

  return (
    <>
      {disableOverlay}
      <Search
        placeholder='Search background'
        onClose={searchCloseCallback}
        onSearch={searchCallback}
        onChange={searchChange}
        className={styles.tabSearch}
        classNameImg={styles.closeIcon}
        disabled={bgType === BackgroundType.COLOR || isBgTransparent}
      />

      {searchWithoutResults && (
        <div className={styles.noResults} style={{ height: `calc(100% - ${listHeight * 2}px)` }}>
          Sorry, nothing matched your search terms. Please try another keyword.
        </div>
      )}

      {!isSearch && (
        <div className={styles.tabBarSection}>
          <p className={styles.tabBarSection_title}>Background color</p>
          <TabColors colors={colorsConsts} />
        </div>
      )}

      {loading && (
        <div className={styles.loading} style={{ top: `${listHeight}px` }}>
          <Loader isLocal />
        </div>
      )}

      {isSearch ? (
        <SearchList lists={searchList} value={searchValue} type={TabTools.Backgrounds} columns='two' />
      ) : (
        <div
          id='catalogBGs'
          style={{
            height: `${window.innerHeight - startHeight - 10}px`,
            position: 'relative',
          }}
        >
          {!isBgTransparent && bgType === BackgroundType.COLOR && (
            <Overlay title='Background images are not available for chosen canvas' minimized />
          )}
          <InfiniteScroll
            dataLength={lists.length}
            className={styles.scroll}
            height={window.innerHeight - startHeight}
            next={loadMoreRows}
            loader={showLoader()}
            hasMore={lists.length !== count && !!lists.length}
            onScroll={onScrollFunc}
          >
            {lists.map((list, i) => (
              <TabLists
                key={list.name}
                lists={list}
                index={i}
                type={TabTools.Backgrounds}
                actionItem={chooseList}
                preview
                columns='two'
                updateList={(dto: ICategoryUpdate) => updateList(dto, list.name)}
                productId={productId}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}

      <div className={!preview ? `${styles.allElements} ${styles.show}` : `${styles.allElements} ${styles.close}`}>
        <div className={styles.listsHeaderBack} onClick={returnLists}>
          <IconArrow className='svg-path-stroke' />
          All Backgrounds
        </div>

        <div
          id='catalogBGs'
          className={styles.defaultScroll}
          style={{
            height: `${window.innerHeight - startHeight + 100}px`,
          }}
        >
          {lists.length !== 0 && (
            <TabCategory productId={productId} list={lists[activeIndex]} type={TabTools.Backgrounds} columns='two' />
          )}
        </div>
      </div>
    </>
  );
};

export default BackgroundsTab;

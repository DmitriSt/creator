import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { ICategoryUpdate } from '../../../../../../../business/interfaces/interfaces';
import TabLoader, { getCategories } from '../../../../../../../business/services/CategoryService';
import getSearchStickers from '../../../../../../../business/services/StickersTabService';
import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import { ReactComponent as IconArrow } from '../../../../../../assets/images/arrowRight.svg';
import { setStickersTab, updateStickersTabCategory } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import Search from '../../../../../sharedComponents/Search/Search';
import styles from '../../../tabBar.module.scss';
import SearchList from '../../shared/SearchList/SearchList';
import TabCategory from '../../shared/TabCategory/TabCategory';
import TabLists from '../../shared/TabLists/TabLists';

const StickersTab = () => {
  const dispatch = useDispatch();

  const stickerTab = useSelector((state: RootStateType) => state.designerState.tabBar.stickerTab);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);
  const apiUrls = useSelector((state: RootStateType) => state.designerState.designer.mainConfig.clipArts);
  const stickersList = useSelector((state: RootStateType) => state.designerState.tabBar.stickerTab?.lists);

  const [lists, setLists] = useState([]);
  const [seacrhList, setSearchList] = useState([]);
  const [count, setCount] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [preview, setPreview] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [searchWithoutResults, setSearchWithoutResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const listHeight = 110;
  const newCategories = 20;

  const isFound = useRef(false);

  useEffect(() => {
    if (stickersList) {
      setLists(stickersList);
      setLoading(false);
    }
  }, [stickersList]);

  useEffect(() => {
    if (stickerTab && stickerTab.lists.length) {
      setCount(stickerTab.count);
      setLists(stickerTab.lists);
      setStartPage(stickerTab.startPage);
    } else {
      const loadState = TabLoader.getTabState(TabTools.Clipart);
      if (loadState && loadState.loading) {
        setLoading(true);
      }
      if (apiUrls && (!loadState || (!loadState.loading && !loadState.loaded))) {
        (async () => {
          setLoading(true);
          TabLoader.addTab(TabTools.Clipart);
          const data = await getCategories(apiUrls.categories, productId, startPage, newCategories);
          setCount(data.count);
          setLists(data.lists);
          dispatch(setStickersTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Clipart, true);
          setLoading(false);
        })();
      }
    }
  }, [apiUrls]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('stickersScrollY'));
    }
  });

  const chooseList = (index: number) => {
    setPreview(false);
    setActiveIndex(index);
  };

  const removeList = () => {
    setPreview(true);
    setActiveIndex(null);
  };

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('stickersScrollY') - 1);
    (async () => {
      const page = stickerTab && stickerTab.startPage ? stickerTab.startPage : startPage;
      async function loadNewStickers() {
        const data = await getCategories(apiUrls.categories, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newStickers = await loadNewStickers();
      if (!isSearch) {
        setLists([...lists, ...newStickers]);
        dispatch(setStickersTab({ count, lists: [...lists, ...newStickers], startPage: page + 1 }));
      }
    })();

    return Promise.resolve();
  }

  const updateList = (dto: ICategoryUpdate) => {
    dispatch(updateStickersTabCategory(dto));
  };

  const searchCallback = useCallback(
    (value: string) => {
      if (!isFound.current) {
        setSearchValue(value);
        (async () => {
          if (apiUrls) {
            setSearch(true);
            const searchData = await getSearchStickers(apiUrls, productId, 0, 100, value);
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
    if (stickerTab && stickerTab.lists.length) {
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

  const myImgScroll = document.getElementById('catalogStickers');
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
    sessionStorage.setItem('stickersScrollY', `${el.scrollTop}`);
  };

  return (
    <>
      <Search
        placeholder='Search cliparts'
        onClose={searchCloseCallback}
        onSearch={searchCallback}
        onChange={searchChange}
        className={styles.tabSearch}
        classNameImg={styles.closeIcon}
      />

      {searchWithoutResults && (
        <div className={styles.noResults} style={{ height: `calc(100% - ${listHeight * 2}px)` }}>
          Sorry, nothing matched your search terms. Please try another keyword.
        </div>
      )}

      {loading && (
        <div className={styles.loading} style={{ top: `${listHeight}px` }}>
          <Loader isLocal />
        </div>
      )}

      {isSearch ? (
        <SearchList lists={seacrhList} value={searchValue} type={TabTools.Clipart} columns='three' />
      ) : (
        <div
          id='catalogStickers'
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
            {lists.map((list, i) => (
              <TabLists
                key={list.name}
                lists={list}
                index={i}
                type={TabTools.Clipart}
                actionItem={chooseList}
                preview
                columns='three'
                productId={productId}
                updateList={updateList}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}

      <div className={!preview ? `${styles.allElements} ${styles.show}` : `${styles.allElements} ${styles.close}`}>
        <div className={styles.listsHeaderBack} onClick={() => removeList()}>
          <IconArrow className='svg-path-stroke' />
          All Cliparts
        </div>
        <div
          id='catalogStickers'
          className={styles.defaultScroll}
          style={{
            height: `${window.innerHeight - startHeight}px`,
          }}
        >
          {lists.length !== 0 && (
            <TabCategory productId={productId} list={lists[activeIndex]} type={TabTools.Clipart} columns='three' />
          )}
        </div>
      </div>
    </>
  );
};

export default StickersTab;

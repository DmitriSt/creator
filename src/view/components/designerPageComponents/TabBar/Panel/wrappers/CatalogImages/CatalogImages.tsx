import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';

import { ICategoryUpdate } from '../../../../../../../business/interfaces/interfaces';
import TabLoader, { getCategories } from '../../../../../../../business/services/CategoryService';
import getSearchImages from '../../../../../../../business/services/ImagesTabServices';
import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import { ReactComponent as IconArrow } from '../../../../../../assets/images/arrowRight.svg';
import { setImagesTab, updateImagesTabCategory } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import Search from '../../../../../sharedComponents/Search/Search';
import styles from '../../../tabBar.module.scss';
import SearchList from '../../shared/SearchList/SearchList';
import TabCategory from '../../shared/TabCategory/TabCategory';
import TabLists from '../../shared/TabLists/TabLists';

const CatalogImages = () => {
  const dispatch = useDispatch();

  const imagesTab = useSelector((state: RootStateType) => state.designerState.tabBar.imagesTab);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);
  const apiUrls = useSelector((state: RootStateType) => state.designerState.designer.mainConfig.images);
  const imagesList = useSelector((state: RootStateType) => state.designerState.tabBar.imagesTab?.lists);

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
  const listHeight = 130;
  const newCategories = 10;

  const isFound = useRef(false);

  useEffect(() => {
    if (imagesList) {
      setLists(imagesList);
      setLoading(false);
    }
  }, [imagesList]);

  useEffect(() => {
    if (imagesTab && imagesTab.lists.length) {
      setCount(imagesTab.count);
      setLists(imagesTab.lists);
      setStartPage(imagesTab.startPage);
    } else {
      const loadState = TabLoader.getTabState(TabTools.Images);
      if (loadState && loadState.loading) {
        setLoading(true);
      }
      if (apiUrls && (!loadState || (!loadState.loading && !loadState.loaded))) {
        (async () => {
          setLoading(true);
          TabLoader.addTab(TabTools.Images);
          const data = await getCategories(apiUrls.categories, productId, startPage, newCategories);
          setCount(data.count);
          setLists(data.lists);
          dispatch(setImagesTab({ count: data.count, lists: data.lists, startPage: 0 }));
          TabLoader.updateTab(TabTools.Images, true);
          setLoading(false);
        })();
      }
    }
  }, [apiUrls]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('catalogScrollY'));
    }
  });

  const chooseList = (index: number) => {
    setPreview(false);
    setActiveIndex(index);
  };

  const removeList = () => {
    setPreview(true);
    setActiveIndex(0);
  };

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('catalogScrollY') - 1);
    (async () => {
      const page = imagesTab && imagesTab.startPage ? imagesTab.startPage : startPage;
      async function loadNewStickers() {
        const data = await getCategories(apiUrls.categories, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newStickers = await loadNewStickers();
      if (!isSearch) {
        setLists([...lists, ...newStickers]);
        dispatch(setImagesTab({ count, lists: [...lists, ...newStickers], startPage: page + 1 }));
      }
    })();

    return Promise.resolve();
  }

  const updateList = (dto: ICategoryUpdate) => {
    dispatch(updateImagesTabCategory(dto));
  };

  const searchCallback = useCallback(
    (value: string) => {
      if (!isFound.current) {
        setSearchValue(value);
        (async () => {
          if (apiUrls) {
            setSearch(true);
            const searchData = await getSearchImages(apiUrls, productId, startPage, 100, value);
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
    if (imagesTab && imagesTab.lists.length) {
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

  const myImgScroll = document.getElementById('catalogImages');
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
    sessionStorage.setItem('catalogScrollY', `${el.scrollTop}`);
  };

  return (
    <>
      <Search
        placeholder='Search images'
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
        <SearchList lists={seacrhList} value={searchValue} type={TabTools.Images} columns='two' />
      ) : (
        <div
          id='catalogImages'
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
                type={TabTools.Images}
                actionItem={chooseList}
                preview
                columns='two'
                productId={productId}
                updateList={updateList}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}

      <div
        className={
          !preview
            ? `${styles.allElements} ${styles.catalog} ${styles.show}`
            : `${styles.allElements} ${styles.catalog} ${styles.close}`
        }
      >
        <div className={styles.listsHeaderBack} onClick={() => removeList()}>
          <IconArrow className='svg-path-stroke' />
          All Images
        </div>

        <div
          id='catalogImages'
          className={styles.defaultScroll}
          style={{
            height: `${window.innerHeight - startHeight}px`,
          }}
        >
          {lists.length !== 0 && (
            <TabCategory productId={productId} list={lists[activeIndex]} type={TabTools.Images} columns='two' />
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogImages;

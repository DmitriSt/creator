import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { getSearchTemplates, getTemplatesTab } from '../../../../../../../business/services/TemplatesTabService';
import { setTemplateTab } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import Search from '../../../../../sharedComponents/Search/Search';
import styles from '../../../tabBar.module.scss';
import TemplateTabElement from '../../elements/TabElement/TemplateTabElement';

const TemplatesTab = () => {
  const dispatch = useDispatch();

  const templateTab = useSelector((state: RootStateType) => state.designerState.tabBar.templateTab);
  const apiUrls = useSelector((state: RootStateType) => state.designerState.designer.mainConfig?.designTemplates);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);

  const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [searchWithoutResults, setSearchWithoutResults] = useState(false);
  const listHeight = 110;
  const newCategories = 10;

  const isFound = useRef(false);

  useEffect(() => {
    if (templateTab && templateTab.lists.length) {
      setCount(templateTab.count);
      setLists(templateTab.lists);
      setStartPage(templateTab.startPage);
    } else {
      setLoading(true);
      if (apiUrls) {
        (async () => {
          const data = await getTemplatesTab(apiUrls, productId, startPage, newCategories);
          setCount(data.count);
          setLists(data.lists);
          dispatch(setTemplateTab({ count: data.count, lists: data.lists, startPage: 0 }));
          setLoading(false);
        })();
      }
    }
  }, [apiUrls]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('templatesScrollY'));
    }
  });

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('templatesScrollY') - 1);
    (async () => {
      const page = templateTab && templateTab.startPage ? templateTab.startPage : startPage;
      async function loadNewStickers() {
        const data = await getTemplatesTab(apiUrls, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newStickers = await loadNewStickers();
      setLists([...lists, ...newStickers]);
      dispatch(setTemplateTab({ count, lists: [...lists, ...newStickers], startPage: page + 1 }));
    })();

    return Promise.resolve();
  }

  const searchCallback = useCallback(
    (value: string) => {
      if (!isFound.current) {
        (async () => {
          if (apiUrls) {
            setSearch(true);
            const searchData = await getSearchTemplates(apiUrls, startPage, newCategories, value);
            if (searchData.lists.length) {
              setSearchWithoutResults(false);
              setLists(searchData.lists);
              setCount(searchData.count);
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

  const searchCloseCallback = (): void => {
    if (templateTab && templateTab.lists.length) {
      setSearch(false);
      setSearchWithoutResults(false);
    }
    return null;
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

  const myImgScroll = document.getElementById('catalogTemplates');
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
    sessionStorage.setItem('templatesScrollY', `${el.scrollTop}`);
  };

  return (
    <>
      <Search
        placeholder='Search templates'
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

      {loading && <Loader />}

      {!isSearch && (
        <div
          id='catalogTemplates'
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
              <TemplateTabElement key={uniqid()} element={list} />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default TemplatesTab;

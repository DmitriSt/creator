import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import getPersonalImagesTab from '../../../../../../../business/services/PersonalImagesService';
import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import {
  setClearImageData,
  setFilesProgress,
  setNewThumbnails,
  setUserImagesTab,
} from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../../../stores/store';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import styles from '../../../tabBar.module.scss';
import ProgressUpload from '../../shared/ProgressUpload/ProgressUpload';
import TabLists from '../../shared/TabLists/TabLists';
import TabUpload from '../../shared/TabUpload/TabUpload';
import UploadArea from '../../shared/UploadArea/UploadArea';
import CatalogImages from '../CatalogImages/CatalogImages';

const ImagesTab = () => {
  const dispatch = useDispatch();

  const tabbar = useSelector((state: RootStateType) => state.designerState.tabBar);
  const newThumbnails = useSelector((state: RootStateType) => state.designerState.tabBar.newThumbnails);
  const newImages = useSelector((state: RootStateType) => state.designerState.tabBar.newImages);
  const chunksComplete = useSelector((state: RootStateType) => state.designerState.tabBar.chunksComplete);
  const countChunks = useSelector((state: RootStateType) => state.designerState.tabBar.countChunks);
  const designId = useSelector((state: RootStateType) => state.designerState.designer.instance.designId);
  const productId = useSelector((state: RootStateType) => state.designerState.designer?.instance?.productId);
  const imagesTab = useSelector((state: RootStateType) => state.designerState.tabBar.userImagesTab);

  const [lists, setLists] = useState([]);
  const [count, setCount] = useState(0);
  const [isMyImgs, setMyImgs] = useState(true);
  const [isCatalog, setCatalog] = useState(false);
  const [oldImages, setOldImages] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(0);
  const listHeight = 130;
  const newCategories = 10;

  useEffect(() => {
    if (imagesTab && imagesTab.lists.length) {
      setCount(imagesTab.count);
      setLists(imagesTab.lists);
      setStartPage(imagesTab.startPage);
      setOldImages(imagesTab.lists[0].elements);
      if (!imagesTab.count) {
        setCatalog(true);
        setMyImgs(false);
      }
    } else {
      setLoading(true);
      (async () => {
        const data = await getPersonalImagesTab(designId, productId, startPage, newCategories);
        setCount(data.count);
        if (data.count) {
          setLists(data.lists);
          setOldImages(data.lists[0].elements);
          dispatch(
            setUserImagesTab({ count: data.count, lists: [{ elements: [...data.lists[0].elements] }], startPage: 0 })
          );
        } else {
          setLists([]);
          setCatalog(true);
          setMyImgs(false);
          dispatch(
            setUserImagesTab({ count: data.count, lists: [{ elements: [...data.lists[0].elements] }], startPage: 0 })
          );
        }
        setLoading(false);
      })();
    }
  }, []);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('imagesScrollY'));
    }
  });

  useEffect(() => {
    if (newImages) {
      dispatch(setFilesProgress(newImages.length));
      newThumbnails.shift();
      dispatch(setNewThumbnails(newThumbnails));
    }
  }, [newImages]);

  useEffect(() => {
    if (newImages.length) {
      if (lists[0]?.elements.length) {
        const newList = [
          {
            elements: [...oldImages, ...newImages, ...newThumbnails],
          },
        ];
        setLists(newList);
        if (!newThumbnails.length && newImages.length) {
          setOldImages(newList[0].elements);
          dispatch(
            setUserImagesTab({
              count,
              lists: [{ elements: [...oldImages, ...newImages, ...newThumbnails] }],
              startPage,
            })
          );
          dispatch(setFilesProgress(0));
          dispatch(setClearImageData());
        }
      } else {
        const newList = [
          {
            elements: [...newImages, ...newThumbnails],
          },
        ];
        dispatch(
          setUserImagesTab({
            count,
            lists: [{ elements: [...newImages, ...newThumbnails] }],
            startPage,
          })
        );
        setLists(newList);
        if (!newThumbnails.length && newImages.length) {
          setOldImages(newList[0].elements);
          dispatch(setFilesProgress(0));
          dispatch(setClearImageData());
        }
      }
    }
  }, [newThumbnails.length, newImages.length]);

  const handleMyImgs = () => {
    setCatalog(false);
    setMyImgs(true);
  };

  const handleCatalog = () => {
    setCatalog(true);
    setMyImgs(false);
  };

  function loadMoreRows() {
    const el = document.querySelector('.infinite-scroll-component');
    el.scrollTo(0, +sessionStorage.getItem('imagesScrollY') - 1);
    (async () => {
      const page = imagesTab && imagesTab.startPage ? imagesTab.startPage : startPage;
      async function loadNewImages() {
        const data = await getPersonalImagesTab(designId, productId, page + 1, newCategories);
        setStartPage(page + 1);
        return data.lists;
      }
      const newImages = await loadNewImages();
      setLists([{ elements: [...lists[0].elements, ...newImages[0].elements] }]);
      setOldImages([...lists[0].elements, ...newImages[0].elements]);
      dispatch(
        setUserImagesTab({
          count,
          lists: [{ elements: [...lists[0].elements, ...newImages[0].elements] }],
          startPage: page + 1,
        })
      );
    })();

    return Promise.resolve();
  }

  const myImgScroll = document.getElementById('myImages');
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
    sessionStorage.setItem('imagesScrollY', `${el.scrollTop}`);
  };

  const uploadArea = useMemo(() => {
    if (!lists[0]?.elements.length) {
      return <UploadArea callback={(e) => setUploadFiles(e)} designId={designId} />;
    }
    return null;
  }, [lists]);

  return (
    <>
      <div className={styles.headerTabs}>
        <div className={isMyImgs ? `${styles.headerTab} ${styles.active}` : styles.headerTab} onClick={handleMyImgs}>
          My Images
        </div>
        <div className={isCatalog ? `${styles.headerTab} ${styles.active}` : styles.headerTab} onClick={handleCatalog}>
          Catalog
        </div>
      </div>

      {loading && (
        <div className={styles.loading} style={{ top: `${listHeight}px` }}>
          <Loader isLocal />
        </div>
      )}

      {!isCatalog && (
        <>
          <div className={styles.tabBarSection}>
            <p className={styles.tabBarSection_title}>Upload From</p>
            <TabUpload callback={(e) => setUploadFiles(e)} designId={designId} />
          </div>

          <ProgressUpload files={uploadFiles} chunksComplete={chunksComplete} countChunks={countChunks} />

          {uploadArea}

          <div
            id='myImages'
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
              hasMore={lists[0]?.elements.length < count}
              onScroll={onScrollFunc}
            >
              {lists.map((list, i) => (
                <TabLists key={uniqid()} lists={list} index={i} type={TabTools.Images} columns='two' />
              ))}
            </InfiniteScroll>
          </div>
        </>
      )}

      {isCatalog && <CatalogImages />}
    </>
  );
};

export default ImagesTab;

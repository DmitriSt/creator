import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { TabTools } from '../../../../../../../models/designer/tabBar.models';
import { ReactComponent as IconArrow } from '../../../../../../assets/images/arrowRight.svg';
import { RootStateType } from '../../../../../../stores/store';
import styles from '../../../tabBar.module.scss';
import TabCategory from '../../shared/TabCategory/TabCategory';
import TabLists from '../../shared/TabLists/TabLists';

const FavouritesTab = () => {
  const favourites = useSelector((state: RootStateType) => state.designerState.designer.favourites);
  const [preview, setPreview] = useState(true);
  const [activeType, setActiveType] = useState('');
  const [layouts, setLayouts] = useState({
    name: '',
    imageCount: 0,
    elements: [],
  });
  const [images, setImages] = useState({
    name: '',
    imageCount: 0,
    elements: [],
  });
  const [bgs, setBgs] = useState({
    name: '',
    imageCount: 0,
    elements: [],
  });
  const [stickers, setStickers] = useState({
    name: '',
    imageCount: 0,
    elements: [],
  });

  useEffect(() => {
    setLayouts({
      name: TabTools.Layouts,
      imageCount: favourites.Layouts.length,
      elements: favourites.Layouts,
    });

    setImages({
      name: TabTools.Images,
      imageCount: favourites.Images.length,
      elements: favourites.Images,
    });

    setBgs({
      name: TabTools.Backgrounds,
      imageCount: favourites.Backgrounds.length,
      elements: favourites.Backgrounds,
    });

    setStickers({
      name: TabTools.Clipart,
      imageCount: favourites.Clipart.length,
      elements: favourites.Clipart,
    });
  }, [favourites.Layouts.length, favourites.Images.length, favourites.Backgrounds.length, favourites.Clipart.length]);

  useEffect(() => {
    const el = document.querySelector('.infinite-scroll-component');
    if (el && !el.scrollTop) {
      el.scrollTo(0, +sessionStorage.getItem('favouritesScrollY'));
    }
  });

  const myImgScroll = document.getElementById('myFavourites');
  let startHeight = 0;

  if (myImgScroll) {
    startHeight = myImgScroll.getBoundingClientRect().top;
  }

  const chooseList = (index: number, type: string) => {
    setPreview(false);
    setActiveType(type);
  };

  const showAllList = useMemo(() => {
    switch (activeType) {
      case TabTools.Layouts:
        return <TabCategory list={layouts} type={TabTools.Layouts} columns='two' favourites />;
      case TabTools.Images:
        return <TabCategory list={images} type={TabTools.Images} columns='two' favourites />;
      case TabTools.Backgrounds:
        return <TabCategory list={bgs} type={TabTools.Backgrounds} columns='two' favourites />;
      case TabTools.Clipart:
        return <TabCategory list={stickers} type={TabTools.Clipart} columns='three' favourites />;
      default:
        return null;
    }
  }, [preview, activeType]);

  const removeList = () => {
    setPreview(true);
    setActiveType('');
  };

  return (
    <>
      <div
        id='myFavourites'
        className={styles.defaultScroll}
        style={{
          height: `${window.innerHeight - startHeight}px`,
        }}
      >
        {layouts.imageCount && preview ? (
          <TabLists
            key={uniqid()}
            lists={layouts}
            index={0}
            type={TabTools.Layouts}
            columns='two'
            preview
            actionItem={chooseList}
            favourites
          />
        ) : null}
        {images.imageCount && preview ? (
          <TabLists
            lists={images}
            index={0}
            type={TabTools.Images}
            columns='two'
            preview
            actionItem={chooseList}
            favourites
          />
        ) : null}
        {bgs.imageCount && preview ? (
          <TabLists
            lists={bgs}
            index={0}
            type={TabTools.Backgrounds}
            columns='two'
            preview
            actionItem={chooseList}
            favourites
          />
        ) : null}
        {stickers.imageCount && preview ? (
          <TabLists
            lists={stickers}
            index={0}
            type={TabTools.Clipart}
            columns='three'
            preview
            actionItem={chooseList}
            favourites
          />
        ) : null}
      </div>

      <div className={!preview ? `${styles.allElements} ${styles.show}` : `${styles.allElements} ${styles.close}`}>
        <div className={styles.listsHeaderBack} onClick={() => removeList()}>
          <IconArrow className='svg-path-stroke' />
          {`All Favourite ${activeType}`}
        </div>
        <div
          id='myFavourites'
          className={styles.defaultScroll}
          style={{
            height: `${window.innerHeight - startHeight}px`,
          }}
        >
          {showAllList}
        </div>
      </div>
    </>
  );
};

export default FavouritesTab;

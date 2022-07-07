import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IWithImage } from '../../../../../../../business/interfaces/featuresInterfaces';
import { ITabElement } from '../../../../../../../business/interfaces/interfaces';
import {
  DragDropElementType,
  TabDragDropComponents,
  TabTools,
} from '../../../../../../../models/designer/tabBar.models';
import hurtIcon from '../../../../../../assets/images/hurt.svg';
import hurtCompleteIcon from '../../../../../../assets/images/hurtComplete.svg';
import {
  removeFavouriteEl,
  setDraggableElement,
  setFavouriteBg,
  setFavouriteId,
} from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import styles from './tabElement.module.scss';

const BGTabElement = ({ element, favourites }: ITabElement) => {
  const dispatch = useDispatch();

  const favouriteIds = useSelector((state: RootStateType) => state.designerState.designer.favouriteIds);
  const favouriteBackgrounds = useSelector(
    (state: RootStateType) => state.designerState.designer.favourites.Backgrounds
  );

  const handleMouseDown = () => {
    const draggable: DragDropElementType<IWithImage> = {
      type: TabDragDropComponents.Background,
      payload: {
        source: element.image.url,
        url: element.image.url,
        mediumUrl: element.image.mediumUrl,
        thumbUrl: element.image.thumbnailUrl,
        originalWidth: element.image.width,
        originalHeight: element.image.height,
      },
    };
    dispatch(setDraggableElement(draggable));
  };

  const handleClick = () => {
    dispatch(setFavouriteBg(element));
    dispatch(setFavouriteId(element.cardId));
  };

  const handleRemove = (id: string) => {
    const updateLayouts = favouriteBackgrounds.filter((el) => el.cardId !== id);
    dispatch(removeFavouriteEl(id, TabTools.Backgrounds, updateLayouts));
  };

  const likeImage = useMemo(() => {
    if (favourites || favouriteIds.indexOf(element.cardId) !== -1) {
      return (
        <div className={`${styles.like} ${styles.active}`} onClick={() => handleRemove(element.cardId)}>
          <img src={hurtCompleteIcon} alt='like' />
        </div>
      );
    }
    return (
      <div className={styles.like} onClick={handleClick}>
        <img src={hurtIcon} alt='like' />
      </div>
    );
  }, [favouriteIds]);

  return (
    <div className={styles.elWrapper}>
      {likeImage}
      <div className={styles.thumb} onMouseDown={handleMouseDown}>
        <img src={element.image.thumbnailUrl} alt='Background' />
        <div className={styles.before} />
      </div>
    </div>
  );
};

export default BGTabElement;

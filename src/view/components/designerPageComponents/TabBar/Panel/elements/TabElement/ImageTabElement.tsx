import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Image from '../../../../../../../business/elements/Image';
import { IWithImage } from '../../../../../../../business/interfaces/featuresInterfaces';
import { IImageWrapper, ITabElement } from '../../../../../../../business/interfaces/interfaces';
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
  setFavouriteId,
  setFavouriteImage,
  setImageEnter,
  setImagesWrappers,
} from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import styles from './tabElement.module.scss';

const ImageTabElement = ({ element, favourites }: any) => {
  const dispatch = useDispatch();

  const favouriteIds = useSelector((state: RootStateType) => state.designerState.designer.favouriteIds);
  const favouriteImages = useSelector((state: RootStateType) => state.designerState.designer.favourites.Images);
  const elements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.getCurrentCanvas().elements
  );
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);

  const createImagesWrappers = () => {
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const bounds = canvas.getBoundingClientRect();
    const imagesWrappers: IImageWrapper[] = [];

    elements.forEach((element) => {
      if (element instanceof Image) {
        const imgPosition = {
          id: element.id,
          x: bounds.left + element.x * coefficient,
          y: bounds.top + element.y * coefficient,
          width: element.width * coefficient,
          height: element.height * coefficient,
          transform: `rotate(${element.rotation}deg)`,
        };
        imagesWrappers.push(imgPosition);
      }
    });
    dispatch(setImagesWrappers(imagesWrappers));
  };

  const handleMouseDown = () => {
    dispatch(setImageEnter(''));
    const draggable: DragDropElementType<IWithImage> = {
      type: TabDragDropComponents.Image,
      payload: {
        source: element.image.mediumUrl,
        url: element.image.url,
        mediumUrl: element.image.mediumUrl,
        thumbUrl: element.image.thumbnailUrl,
        originalWidth: element.image.width,
        originalHeight: element.image.height,
      },
    };
    dispatch(setDraggableElement(draggable));
    createImagesWrappers();
  };

  const handleClick = () => {
    dispatch(setFavouriteImage(element));
    dispatch(setFavouriteId(`${element.cardId}${TabTools.Images}`));
  };

  const handleRemove = (id: string) => {
    const updateLayouts = favouriteImages.filter((el) => el.cardId !== id);
    dispatch(removeFavouriteEl(id, TabTools.Images, updateLayouts));
  };

  const likeImage = useMemo(() => {
    if (favourites || favouriteIds.indexOf(`${element.cardId}${TabTools.Images}`) !== -1) {
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
    element.image.thumbnailUrl && (
      <div className={styles.elWrapper}>
        {likeImage}
        <div
          className={element?.image.upload ? `${styles.background} ${styles.new}` : styles.background}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.thumb}>
            <img src={element.image.thumbnailUrl} alt='Background' />
            <div className={styles.before} />
          </div>
        </div>
      </div>
    )
  );
};

export default ImageTabElement;

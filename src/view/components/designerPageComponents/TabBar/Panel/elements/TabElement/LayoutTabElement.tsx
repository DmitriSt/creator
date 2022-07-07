import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ILayoutElementConfig } from '../../../../../../../business/interfaces/configsInterfaces';
import { ILayoutElement, ILayoutElementContent } from '../../../../../../../business/interfaces/interfaces';
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
  setFavouriteLayout,
} from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import styles from './tabElement.module.scss';

type LayoutTabElementPropsType = {
  element: ILayoutElementConfig<ILayoutElementContent>;
  favourites?: boolean;
};

const LayoutTabElement = ({ element, favourites }: LayoutTabElementPropsType) => {
  const dispatch = useDispatch();

  const favouriteIds = useSelector((state: RootStateType) => state.designerState.designer.favouriteIds);
  const favouriteLayouts = useSelector((state: RootStateType) => state.designerState.designer.favourites.Layouts);

  const handleMouseDown = () => {
    const draggable: DragDropElementType<ILayoutElement> = {
      type: TabDragDropComponents.Layout,
      payload: {
        url: element.url,
        json: element.json,
      },
    };
    dispatch(setDraggableElement(draggable));
  };

  const handleClick = () => {
    dispatch(setFavouriteLayout(element));
    dispatch(setFavouriteId(element.cardId));
  };

  const handleRemove = (id: string) => {
    const updateLayouts = favouriteLayouts.filter((el) => el.cardId !== id);
    dispatch(removeFavouriteEl(id, TabTools.Layouts, updateLayouts));
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
      <div className={favourites ? '' : styles.tabBarTemplateSection} onMouseDown={handleMouseDown}>
        <div className={styles.thumb}>
          <img src={element.url} alt='Layout' />
          <div className={styles.before} />
        </div>
      </div>
    </div>
  );
};

export default LayoutTabElement;

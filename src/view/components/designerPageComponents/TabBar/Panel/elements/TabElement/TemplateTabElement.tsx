import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IWithImage } from '../../../../../../../business/interfaces/featuresInterfaces';
import { ITemplateElement } from '../../../../../../../business/interfaces/interfaces';
import { DragDropElementType, TabDragDropComponents } from '../../../../../../../models/designer/tabBar.models';
import hurtIcon from '../../../../../../assets/images/hurt.svg';
import { setDraggableElement } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import styles from './tabElement.module.scss';

const TemplateTabElement = ({ element }: any) => {
  const dispatch = useDispatch();

  const activeTemplate = useSelector((state: RootStateType) => state.designerState.designer.activeTemplate);

  const handleMouseDown = () => {
    const draggable: DragDropElementType<IWithImage> = {
      type: TabDragDropComponents.Template,
      payload: {
        source: element.thumbnailUrl,
        url: element.url,
        mediumUrl: element.mediumUrl,
        thumbUrl: element.thumbnailUrl,
        originalWidth: element.originalWidth,
        originalHeight: element.originalHeight,
      },
    };
    dispatch(setDraggableElement(draggable));
    // dispatch(setActiveTemplate(element.sourceId));
  };

  return (
    <div
      className={
        activeTemplate === element.sourceId
          ? `${styles.tabBarTemplateSection} ${styles.active}`
          : styles.tabBarTemplateSection
      }
      onMouseDown={handleMouseDown}
    >
      <div className={styles.template}>
        <div className={styles.like}>
          <img src={hurtIcon} alt='like' />
        </div>
        <div className={styles.thumb}>
          <img src={element.mediumUrl} alt='Template' />
          <div className={styles.before} />
        </div>
        <p className={styles.mainTitle}>{element.name}</p>
      </div>
    </div>
  );
};

export default TemplateTabElement;

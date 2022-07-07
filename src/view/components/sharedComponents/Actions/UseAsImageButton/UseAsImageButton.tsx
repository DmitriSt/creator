import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackgroundImage from '../../../../../business/elements/BackgroundImage';
import createCanvasElements from '../../../../../business/factories/previewToElementFactory';
import { IWithFilters, IWithImage } from '../../../../../business/interfaces/featuresInterfaces';
import { TabDragDropComponents } from '../../../../../models/designer/tabBar.models';
import { ReactComponent as ImageIcon } from '../../../../assets/images/designer/image.svg';
import { commandUseAsImage } from '../../../../helpers/commands';
import { RootStateType } from '../../../../stores/store';
import ActionButton from '../ActionButton/ActionButton';
import styles from './useAsImageButton.module.scss';

type UseAsImageButtonPropsType = {
  titled?: boolean;
};

const UseAsImageButton = ({ titled = true }: UseAsImageButtonPropsType) => {
  const dispatch = useDispatch();

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const imagesOnCanvas = useSelector((state: RootStateType) => state.designerState.designer.imagesOnCanvas);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const countImages = useSelector(
    (state: RootStateType) => state.designerState.product.pages[activePage].canvases[activeCanvas].pictureOptions
  );
  const background = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.getCurrentCanvas().elements[0] as BackgroundImage
  );

  const useAsImageBg = () => {
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const bounds = canvas.getBoundingClientRect();
    const newBG = createCanvasElements({
      type: TabDragDropComponents.Color,
      payload: {
        source: '',
        color: '#ffffff',
        originalWidth: bounds.width,
        originalHeight: bounds.height,
      },
      position: {
        x: bounds.left,
        y: bounds.top,
        coefficient,
      },
    })[0];

    const newImage = createCanvasElements<IWithFilters & IWithImage>({
      type: TabDragDropComponents.Image,
      payload: {
        source: background.source,
        thumbUrl: background.thumbUrl,
        mediumUrl: background.mediumUrl,
        url: background.url,
        originalWidth: background.originalWidth,
        originalHeight: background.originalHeight,
        filters: background.filters,
      },
      position: {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        coefficient,
      },
    })[0];

    if (imagesOnCanvas === countImages.maxCount) return;
    commandUseAsImage(dispatch, background, newBG, newImage);
  };

  return (
    <ActionButton
      icon={<ImageIcon className='svg-path-fill' />}
      value={titled ? 'Use as Image' : undefined}
      onClick={useAsImageBg}
      className={imagesOnCanvas === countImages.maxCount ? `${styles.disabled}` : ''}
    />
  );
};

export default UseAsImageButton;

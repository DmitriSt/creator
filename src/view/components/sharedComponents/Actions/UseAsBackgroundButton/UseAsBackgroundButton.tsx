import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackgroundColor from '../../../../../business/elements/BackgroundColor';
import Image from '../../../../../business/elements/Image';
import createCanvasElements from '../../../../../business/factories/previewToElementFactory';
import { IWithFilters, IWithImage } from '../../../../../business/interfaces/featuresInterfaces';
import { BackgroundType } from '../../../../../models/designer/designer.models';
import { TabDragDropComponents } from '../../../../../models/designer/tabBar.models';
import { ReactComponent as BackgroundIcon } from '../../../../assets/images/designer/background.svg';
import { commandUseAsBackground } from '../../../../helpers/commands';
import { RootStateType } from '../../../../stores/store';
import ActionButton from '../ActionButton/ActionButton';
import styles from './useAsBackgroundButton.module.scss';

type UseAsBackgroundButtonPropsType = {
  titled?: boolean;
};

const UseAsBackgroundButton = ({ titled = true }: UseAsBackgroundButtonPropsType) => {
  const dispatch = useDispatch();

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const isBgTransparent = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions.isTransparent
  );
  const bgType = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions.type
  );
  const selectedElement = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements[0] as Image
  );
  const background = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.getCurrentCanvas().elements[0]
  ) as BackgroundColor;

  const replaceBG = () => {
    if (isBgTransparent || bgType === BackgroundType.COLOR) return;
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const bounds = canvas.getBoundingClientRect();
    const newBg = createCanvasElements<IWithFilters & IWithImage>({
      type: TabDragDropComponents.Background,
      payload: {
        source: selectedElement.url,
        thumbUrl: selectedElement.thumbUrl,
        mediumUrl: selectedElement.mediumUrl,
        url: selectedElement.url,
        originalWidth: selectedElement.originalWidth,
        originalHeight: selectedElement.originalHeight,
        filters: selectedElement.filters,
      },
      position: {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        coefficient,
      },
      zoom,
    })[0];
    commandUseAsBackground(dispatch, selectedElement, newBg, background);
  };

  return (
    <ActionButton
      className={isBgTransparent || bgType === BackgroundType.COLOR ? styles.disabled : ''}
      icon={<BackgroundIcon className='svg-path-fill' />}
      value={titled ? 'Use as Background' : undefined}
      onClick={replaceBG}
    />
  );
};

export default UseAsBackgroundButton;

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../../business/elements/BaseElement';
import designer from '../../../../../../../business/elements/Designer';
import * as Guard from '../../../../../../../business/Guard';
import {
  ICroppable,
  IFlippable,
  IWithFilters,
  IWithImage,
} from '../../../../../../../business/interfaces/featuresInterfaces';
import { ICrop, IDimension, IPosition } from '../../../../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../../../../models/constants/designer';
import { DesignerElementType } from '../../../../../../../models/designer/designer.models';
import { setStatus, updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import { getSvgFilters } from '../../helpers/svgFilters';
import { getImageMask } from '../../helpers/svgMasks';

const BackgroundImageElement = ({ id, thumbnail, cropMoveShift }: DesignerElementType) => {
  const dispatch = useDispatch();

  const isBGEnter = useSelector((state: RootStateType) => state.designerState.tabBar.isBGEnter);
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const zoom = thumbnail ? 1 : useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const element = useSelector((state: RootStateType) =>
    state.designerState.designer.instance.getElementById(id)
  ) as BaseElement & IWithImage & IWithFilters & IFlippable & ICroppable;

  const ratio = useMemo<number>(() => {
    if (!Guard.isCroppable(element)) return 1;
    const wRatio = element ? element.width / element.crop.width : 1;
    const hRatio = element ? element.height / element.crop.height : 1;
    return Math.max(wRatio, hRatio);
  }, [element, element?.crop]);

  const placeholder = useMemo<ICrop>(() => {
    if (!element) return null;
    const newX = Guard.isCroppable(element) ? element.crop.x * ratio : 0;
    const newY = Guard.isCroppable(element) ? element.crop.y * ratio : 0;
    const width = element.originalWidth * ratio;
    const height = element.originalHeight * ratio;
    return {
      x: Guard.isFlippable(element) && element.flip.horizontal ? width - newX : newX,
      y: Guard.isFlippable(element) && element.flip.vertical ? height - newY : newY,
      width,
      height,
    };
  }, [ratio, element, element?.crop, element?.flip]);

  const isCropping = useMemo<boolean>(
    () => status === ElementStatuses.CroppingMode && selectedElements.length && selectedElements[0].id === id,
    [status, selectedElements]
  );

  const isCanvasCropping = useMemo<boolean>(() => isCropping && !thumbnail, [isCropping, thumbnail]);

  const currentStatus = useMemo(() => {
    if (isCanvasCropping) return ElementStatuses.CroppingMode;
    return ElementStatuses.Stable;
  }, [isCanvasCropping]);

  useEffect(() => {
    dispatch(setStatus(currentStatus));
  }, [currentStatus]);

  const translateWrapper = useMemo<string>(() => {
    if (!element) return '';
    const newX = (element.x - element.width / 2) * zoom;
    const newY = (element.y - element.height / 2) * zoom;
    if (isCanvasCropping && placeholder) {
      const placeholderX = (element.x - placeholder.x) * zoom;
      const placeholderY = (element.y - placeholder.y) * zoom;
      return `translate(${placeholderX} ${placeholderY})`;
    }
    return `translate(${newX} ${newY})`;
  }, [element, placeholder, isCanvasCropping, zoom]);

  const translateImage = useMemo<string>(() => {
    if (!element || !placeholder) return '';
    const hFlipShift = Guard.isFlippable(element) && element.flip.horizontal ? placeholder.width : 0;
    const vFlipShift = Guard.isFlippable(element) && element.flip.vertical ? placeholder.height : 0;
    return `translate(${hFlipShift} ${vFlipShift})`;
  }, [element, element?.flip, placeholder]);

  const flipImage = useMemo<string>(() => {
    if (!element) return '';
    const scaleX = Guard.isFlippable(element) && element.flip.horizontal ? -1 : 1;
    const scaleY = Guard.isFlippable(element) && element.flip.vertical ? -1 : 1;
    return `scale(${scaleX} ${scaleY})`;
  }, [element, element?.flip]);

  const transformImage = useMemo(() => `${translateImage} ${flipImage}`, [translateImage, flipImage]);

  const imageDimensions = useMemo<IDimension>(
    () => ({
      width: placeholder ? placeholder.width : 0,
      height: placeholder ? placeholder.height : 0,
    }),
    [placeholder?.width, placeholder?.height]
  );

  const dimensions = useMemo<IDimension>(() => {
    if (!element) return { width: 0, height: 0 };
    return {
      width: (isCanvasCropping ? imageDimensions.width : element.width) * zoom,
      height: (isCanvasCropping ? imageDimensions.height : element.height) * zoom,
    };
  }, [element, zoom, imageDimensions, isCanvasCropping]);

  const leftTop = useMemo<IPosition>(() => {
    if (!element || !placeholder) return null;
    return {
      x: placeholder.x - element.width / 2 - (cropMoveShift ? cropMoveShift.x / zoom : 0),
      y: placeholder.y - element.height / 2 - (cropMoveShift ? cropMoveShift.y / zoom : 0),
    };
  }, [cropMoveShift, placeholder, element, zoom]);

  const viewbox = useMemo<string>(() => {
    if (!element || !leftTop) return null;
    const cropView = `0 0 ${imageDimensions.width} ${imageDimensions.height}`;
    const defaultView = `${leftTop.x} ${leftTop.y} ${element.width} ${element.height}`;
    return isCanvasCropping ? cropView : defaultView;
  }, [element, imageDimensions, leftTop, isCanvasCropping]);

  const maskPosition = useMemo<IPosition>(() => {
    const posX = leftTop?.x || 0;
    const posY = leftTop?.y || 0;
    if (!element || !placeholder) return { x: posX, y: posY };
    return {
      x: Guard.isFlippable(element) && element.flip.horizontal ? placeholder.width - element.width - posX : posX,
      y: Guard.isFlippable(element) && element.flip.vertical ? placeholder.height - element.height - posY : posY,
    };
  }, [element, element?.flip, placeholder, leftTop]);

  const handleMouseDown = () => {
    if (!element && thumbnail) return;
    designer.setSelectedElements([element.id]);
    designer.overlapElements = [];
    dispatch(updateDesigner(designer));
  };

  const handleEscPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') dispatch(setStatus(ElementStatuses.Stable));
  };

  useEffect(() => {
    if (isCanvasCropping) {
      document.body.addEventListener('keydown', handleEscPress);
    } else {
      document.body.removeEventListener('keydown', handleEscPress);
    }
  }, [isCanvasCropping]);

  const handleDoubleClick = () => {
    if (thumbnail || !element?.source) return;
    dispatch(
      setStatus(status === ElementStatuses.CroppingMode ? ElementStatuses.Stable : ElementStatuses.CroppingMode)
    );
  };

  const filters = useMemo(() => getSvgFilters(element), [element?.filters]);

  const imageMask = useMemo(() => getImageMask(element, maskPosition, imageDimensions), [
    element,
    maskPosition,
    imageDimensions,
  ]);

  const renderImage = useMemo<JSX.Element>(
    () => (
      <image
        width={imageDimensions.width}
        height={imageDimensions.height}
        href={element?.source}
        transform={transformImage}
        preserveAspectRatio='xMidYMid slice'
        mask={imageMask?.id && `url(#${imageMask?.id})`}
        filter={filters?.id && `url(#${filters?.id})`}
      />
    ),
    [element, imageDimensions, transformImage]
  );

  return (
    <g transform={translateWrapper} onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown}>
      <svg
        id={id}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={viewbox}
        style={{ display: 'block' }}
        opacity={isBGEnter ? 0.5 : 1}
      >
        <defs>
          {imageMask?.render}
          {filters?.render}
        </defs>
        {renderImage}
      </svg>
    </g>
  );
};

export default BackgroundImageElement;

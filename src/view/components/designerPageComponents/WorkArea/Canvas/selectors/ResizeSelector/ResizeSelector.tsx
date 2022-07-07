import throttle from 'lodash.throttle';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../../business/elements/BaseElement';
import designer from '../../../../../../../business/elements/Designer';
import Image from '../../../../../../../business/elements/Image';
import QR from '../../../../../../../business/elements/QR';
import Sticker from '../../../../../../../business/elements/Sticker';
import Text from '../../../../../../../business/elements/Text';
import * as Guard from '../../../../../../../business/Guard';
import { IElement, IPosition, IVector } from '../../../../../../../business/interfaces/interfaces';
import ResizeManager from '../../../../../../../business/managers/ResizeManager';
import consts from '../../../../../../../models/constants/consts';
import { Aligns, ElementStatuses } from '../../../../../../../models/constants/designer';
import checkLayers from '../../../../../../helpers/checkLayers';
import { commandDeleteElement, commandResizeElement, commandResizeText } from '../../../../../../helpers/commands';
import { isElementOutOfCanvas } from '../../../../../../helpers/designer';
import { getSuitableImageSize } from '../../../../../../helpers/utils';
import { setStatus, updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import RotateSelector from '../RotateSelector/RotateSelector';
import styles from './resizeSelector.module.scss';

function toggleElementVisibility(element: Element, flag: boolean): void {
  const children = [...element.children] as HTMLDivElement[];
  children.forEach((item) => {
    if (flag) {
      item.style.visibility = 'visible';
      item.style.pointerEvents = 'all';
    } else {
      item.style.visibility = 'hidden';
      item.style.pointerEvents = 'none';
    }
  });
}

function checkResizerDimension(entries: ResizeObserverEntry[], checker: (ref: DOMRect) => boolean): void {
  if (!entries[0]) return;
  toggleElementVisibility(entries[0].target, checker(entries[0].contentRect));
}

function checkWidth(ref: DOMRect): boolean {
  return ref.width > consts.resizeSelector.VERTICAL_RESIZER_WIDTH * (1 + consts.resizeSelector.BORDER_RATIO);
}

function checkHeight(ref: DOMRect): boolean {
  return ref.height > consts.resizeSelector.HORIZONTAL_RESIZER_HEIGHT * (1 + consts.resizeSelector.BORDER_RATIO);
}

const ResizeSelector = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const canvasElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas().elements
  );

  const [align, setAlign] = useState<Aligns>(null);

  const horizontalResizeRef = useRef<HTMLDivElement>(null);
  const verticalResizeRef = useRef<HTMLDivElement>(null);

  const prevClient = useRef<IPosition>(null);
  const currClient = useRef<IPosition>(null);
  const prevBounds = useRef<IElement>(null);
  const currCoefficient = useRef(1);

  const initialFontSize = useRef(null);

  const elementsWithImage = useMemo(() => Guard.getElementsWithImage(selectedElements || []), [selectedElements]);
  const elementsWithText = useMemo(() => Guard.getElementsWithText(selectedElements || []), [selectedElements]);

  const isElementsWithImageExist = useMemo(() => elementsWithImage.length > 0, [elementsWithImage]);
  const isElementsWithTextExist = useMemo(() => elementsWithText.length > 0, [elementsWithText]);

  useEffect(() => {
    currCoefficient.current = coefficient || 1;
  }, [coefficient]);

  const resizeText = throttle((element: Text, shift: IVector) => {
    const designerElement = designer.getElementById(element.id) as Text;
    const newTextElement = ResizeManager.resizeText(
      element,
      shift,
      align,
      element.text,
      initialFontSize.current,
      elementsWithText[0].fontFamily
    );
    designerElement.bounds = newTextElement.bounds;
    designerElement.manuallyResized = newTextElement.manuallyResized;
    designerElement.fontSize = newTextElement.fontSize;
  }, 50);

  const resizeImage = throttle((element: Image, shift: IVector) => {
    const designerElement = designer.getElementById(element.id) as Image;
    const newImageElement = ResizeManager.resizeImage(element, shift, align);
    designerElement.bounds = newImageElement.bounds;
    designerElement.crop = newImageElement.crop;
    designerElement.source = getSuitableImageSize(newImageElement, newImageElement.width);
  }, 20);

  const resizeElement = throttle((element: BaseElement, shift: IVector) => {
    const designerElement = designer.getElementById(element.id);
    designerElement.bounds = ResizeManager.resize(element, shift, align).bounds;
  }, 20);

  const throttledResize = throttle(() => {
    dispatch(setStatus(ElementStatuses.Resizing));
    const activeElement = selectedElements[0];
    if (prevClient && currClient && activeElement) {
      const shift: IVector = {
        x: (currClient.current.x - prevClient.current.x) / zoom,
        y: (currClient.current.y - prevClient.current.y) / zoom,
      };
      if (shift.x === 0 && shift.y === 0) return;
      if (isElementsWithTextExist) {
        resizeText(activeElement as Text, shift);
      } else if (isElementsWithImageExist) {
        resizeImage(activeElement as Image, shift);
      } else {
        resizeElement(activeElement, shift);
      }
      const designerElement = designer.getElementById(activeElement.id);
      const layers = checkLayers(designerElement, canvasElements);
      designer.isLayers = !!layers.length;
      designer.overlapElements = layers;
      dispatch(updateDesigner(designer));
    }
  }, 5);

  const handleMouseMove = (e: MouseEvent) => {
    currClient.current = {
      x: e.clientX / currCoefficient.current,
      y: e.clientY / currCoefficient.current,
    };
    throttledResize();
  };

  const handleMouseUp = () => {
    const activeElement = selectedElements[0];
    const designerElement = designer.getElementById(activeElement.id);
    document.body.removeEventListener('mousemove', handleMouseMove, false);
    document.body.removeEventListener('mouseup', handleMouseUp, false);
    setAlign(null);
    const isOutOfCanvas = isElementOutOfCanvas(selectedElements[0].id);
    if (isOutOfCanvas) {
      commandDeleteElement(dispatch, selectedElements);
      return;
    }
    if (isElementsWithTextExist) {
      commandResizeText(
        dispatch,
        { ...prevBounds.current, fontSize: initialFontSize.current },
        { ...designerElement.bounds, fontSize: (designerElement as Text).fontSize },
        activeElement.id
      );
      initialFontSize.current = elementsWithText[0].fontSize;
    } else if (prevBounds.current) {
      commandResizeElement(dispatch, prevBounds.current, designerElement.bounds, activeElement.id);
    }
    dispatch(setStatus(ElementStatuses.Stable));
  };

  const isMoving = useMemo(() => status === ElementStatuses.Moving, [status]);

  const isVisible = useMemo(() => selectedElements?.length > 0 && !isMoving, [selectedElements, isMoving]);

  const style = useMemo<React.CSSProperties>(() => {
    if (isVisible && selectedElements.length) {
      const activeElement = selectedElements[0];
      const width = activeElement.width * coefficient * zoom;
      const height = activeElement.height * coefficient * zoom;
      const posX = activeElement.x * zoom * coefficient - width / 2;
      const posY = activeElement.y * zoom * coefficient - height / 2;
      const transformations = [`translate(${posX}px, ${posY}px)`];
      if (Guard.isRotatables([activeElement])) {
        const element = Guard.getRotatables([activeElement])[0];
        transformations.push(`rotate(${element.rotation}deg)`);
      }
      return {
        width,
        height,
        transform: transformations.join(' '),
      };
    }
    return {
      display: 'none',
    };
  }, [isVisible, selectedElements, coefficient, zoom]);

  useEffect(() => {
    if (align !== null) {
      document.body.addEventListener('mousemove', handleMouseMove, false);
      document.body.addEventListener('mouseup', handleMouseUp, false);
    }
  }, [align]);

  const handleMouseDown = (e: React.MouseEvent, align: Aligns) => {
    e.stopPropagation();
    const activeElement = selectedElements[0];
    if (activeElement) {
      setAlign(align);
      prevClient.current = {
        x: e.clientX / currCoefficient.current,
        y: e.clientY / currCoefficient.current,
      };
      prevBounds.current = {
        width: activeElement.width,
        height: activeElement.height,
        x: activeElement.x,
        y: activeElement.y,
      };
    }
    if (isElementsWithTextExist) {
      initialFontSize.current = elementsWithText[0].fontSize;
    }
  };

  const selectTop = (e: React.MouseEvent) => handleMouseDown(e, Aligns.Top);
  const selectRight = (e: React.MouseEvent) => handleMouseDown(e, Aligns.Right);
  const selectBottom = (e: React.MouseEvent) => handleMouseDown(e, Aligns.Bottom);
  const selectLeft = (e: React.MouseEvent) => handleMouseDown(e, Aligns.Left);

  const selectLeftTop = (e: React.MouseEvent) => handleMouseDown(e, Aligns.LeftTop);
  const selectRightTop = (e: React.MouseEvent) => handleMouseDown(e, Aligns.RightTop);
  const selectRightBottom = (e: React.MouseEvent) => handleMouseDown(e, Aligns.RightBottom);
  const selectLeftBottom = (e: React.MouseEvent) => handleMouseDown(e, Aligns.LeftBottom);

  const cornerResize = (
    <div className={styles.corners}>
      <div className={styles.circle} onMouseDown={selectLeftTop} />
      <div className={styles.circle} onMouseDown={selectRightTop} />
      <div className={styles.circle} onMouseDown={selectRightBottom} />
      <div className={styles.circle} onMouseDown={selectLeftBottom} />
    </div>
  );

  const verticalResize = (
    <div className={styles.vertical} ref={verticalResizeRef}>
      <div className={styles.line} onMouseDown={selectTop} />
      <div className={styles.line} onMouseDown={selectBottom} />
    </div>
  );

  const horizontalResize = (
    <div className={styles.horizontal} ref={horizontalResizeRef}>
      <div className={styles.line} onMouseDown={selectLeft} />
      <div className={styles.line} onMouseDown={selectRight} />
    </div>
  );

  useEffect(() => {
    const verticalResizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => verticalResizeRef.current && checkResizerDimension(entries, checkWidth)
    );
    const horizontalResizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => horizontalResizeRef.current && checkResizerDimension(entries, checkHeight)
    );
    if (verticalResizeRef.current) verticalResizeObserver.observe(verticalResizeRef.current);
    if (horizontalResizeRef.current) horizontalResizeObserver.observe(horizontalResizeRef.current);
    return () => {
      if (verticalResizeRef.current) verticalResizeObserver.unobserve(verticalResizeRef.current);
      if (horizontalResizeRef.current) horizontalResizeObserver.unobserve(horizontalResizeRef.current);
    };
  }, [selectedElements]);

  const resizer = useMemo(() => {
    if (!selectedElements || selectedElements.length > 1) return null;
    if (selectedElements[0] instanceof Image) {
      return (
        <>
          <RotateSelector />
          {verticalResize}
          {horizontalResize}
          {cornerResize}
        </>
      );
    }
    if (selectedElements[0] instanceof Sticker || selectedElements[0] instanceof QR) {
      return (
        <>
          <RotateSelector />
          {cornerResize}
        </>
      );
    }
    if (selectedElements[0] instanceof Text) {
      return (
        <>
          <RotateSelector />
          {horizontalResize}
          {cornerResize}
        </>
      );
    }
    return null;
  }, [selectedElements]);

  return (
    isVisible && (
      <div className={styles.resizer} style={style}>
        {resizer}
      </div>
    )
  );
};

export default ResizeSelector;

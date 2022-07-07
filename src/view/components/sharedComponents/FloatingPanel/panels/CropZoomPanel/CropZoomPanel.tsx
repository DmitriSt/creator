import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../business/elements/BaseElement';
import designer from '../../../../../../business/elements/Designer';
import * as Guard from '../../../../../../business/Guard';
import { ICroppable, IWithImage } from '../../../../../../business/interfaces/featuresInterfaces';
import { ICrop } from '../../../../../../business/interfaces/interfaces';
import CropManager from '../../../../../../business/managers/CropManager';
import cropZoom from '../../../../../assets/images/designer/cropZoom.svg';
import successIcon from '../../../../../assets/images/designer/success.svg';
import { commandCropElement } from '../../../../../helpers/commands';
import { between, getSuitableImageSize } from '../../../../../helpers/utils';
import { updateDesigner } from '../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../stores/store';
import styles from './cropZoomPanel.module.scss';

type ProportionsModeType = 'Current' | 'Free' | 'Square' | 'Product';
type OrientationModeType = 'Horizontal' | 'Vertical';

type LimitsType = {
  min: number;
  max: number;
};

const CropZoomPanel = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const [limits, setLimits] = useState<LimitsType>({
    min: 0,
    max: 0,
  });
  const [zoomPos, setZoomPos] = useState(0);
  const [zoomValue, setZoomValue] = useState(1);

  const [proportionsMode, setProportionsMode] = useState<ProportionsModeType>('Current');
  const [orientationMode, setOrientationMode] = useState<OrientationModeType>('Vertical');

  const prevClientX = useRef(0);
  const prevElementCrop = useRef<ICrop>(null);
  const currElementCrop = useRef<ICrop>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const activeElement = useMemo(() => {
    if (selectedElements.length === 1) {
      const croppables = Guard.getCroppables(selectedElements);
      const elementsWithImage = Guard.getElementsWithImage(croppables);
      return elementsWithImage[0];
    }
    return null;
  }, [selectedElements]);

  const ratio = useMemo(() => {
    const wRatio = activeElement ? activeElement.width / activeElement.crop.width : 1;
    const hRatio = activeElement ? activeElement.height / activeElement.crop.height : 1;
    return between(Math.max(wRatio, hRatio), 0, 1);
  }, [activeElement?.width, activeElement?.height, activeElement?.crop.width, activeElement?.crop.height]);

  useLayoutEffect(() => {
    if (activeElement) {
      const limitRatio = activeElement.originalWidth / activeElement.originalHeight;
      const limit =
        activeElement.originalWidth > activeElement.originalHeight
          ? activeElement.height * limitRatio
          : activeElement.width;
      setLimits({
        min: limit < activeElement.width ? activeElement.width : limit,
        max: activeElement.originalWidth,
      });
    }
  }, [activeElement?.id]);

  const minZoom = useMemo(() => limits.min / limits.max || 0, [limits]);

  const sliderWidth = useMemo(() => sliderRef.current?.getBoundingClientRect().width || 0, [sliderRef.current]);

  useLayoutEffect(() => {
    const initialZoom = ratio;
    const newPos = ((initialZoom - minZoom) / (1 - minZoom)) * sliderWidth;
    if (initialZoom <= minZoom) {
      setZoomPos(0);
    } else if (initialZoom >= 1) {
      setZoomPos(sliderWidth);
    } else {
      setZoomPos(between(newPos, 0, sliderWidth));
    }
  }, [minZoom, sliderWidth]);

  useLayoutEffect(() => {
    const unit = (1 - minZoom) / (sliderWidth || 1);
    const value = between(minZoom + unit * zoomPos, minZoom, 1);
    setZoomValue(value);
  }, [minZoom, zoomPos, sliderWidth]);

  useEffect(() => {
    if (activeElement && prevElementCrop.current) {
      const zoomedElement = CropManager.zoom(activeElement, minZoom / zoomValue);
      const designerElement = designer.getElementById(activeElement.id) as BaseElement & IWithImage & ICroppable;
      if (designerElement) {
        currElementCrop.current = zoomedElement.crop;
        designerElement.crop = zoomedElement.crop;
        designerElement.source = getSuitableImageSize(designerElement, designerElement.originalWidth * zoomValue);
        dispatch(updateDesigner(designer));
      }
    }
  }, [zoomValue, minZoom]);

  const handleMouseMove = (e: MouseEvent) => {
    const newX = zoomPos + e.clientX - prevClientX.current;
    setZoomPos(between(newX, 0, sliderWidth));
  };

  const isEqual = (a: ICrop, b: ICrop) => {
    return a.width === b.width && a.height === b.height && a.x === b.x && a.y === b.y;
  };

  const handleMouseUp = () => {
    document.body.removeEventListener('mousemove', handleMouseMove, false);
    document.body.removeEventListener('mouseup', handleMouseUp, false);
    if (!prevElementCrop.current || !currElementCrop.current) return;
    if (!isEqual(prevElementCrop.current, currElementCrop.current)) {
      commandCropElement(dispatch, prevElementCrop.current, currElementCrop.current, activeElement.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.body.addEventListener('mousemove', handleMouseMove, false);
    document.body.addEventListener('mouseup', handleMouseUp, false);
    prevClientX.current = e.clientX;
    if (activeElement) {
      prevElementCrop.current = { ...activeElement.crop };
    }
  };

  const proportionElement = useCallback(
    (mode: ProportionsModeType) => (
      <div className={styles.tool}>
        <button
          type='button'
          className={proportionsMode === mode ? `${styles.button} ${styles.active}` : `${styles.button}`}
          onClick={() => setProportionsMode(mode)}
        >
          {mode}
        </button>
      </div>
    ),
    [proportionsMode]
  );

  const orientationElement = useCallback(
    (mode: OrientationModeType) => {
      const classes = [styles.turn];
      if (mode === 'Vertical') {
        classes.push(styles.vertical);
      }
      if (orientationMode === mode) {
        classes.push(styles.active);
      }
      return (
        <div className={styles.tool}>
          <div className={classes.join(' ')} onClick={() => setOrientationMode(mode)}>
            <img src={successIcon} alt={mode} />
          </div>
        </div>
      );
    },
    [orientationMode]
  );

  return (
    !!activeElement && (
      <div className={styles.crop}>
        <div className={styles.wrapper_zoom}>
          <div className={styles.item}>
            <img className={styles.image} src={cropZoom} alt='Slider' />
            <span className={styles.title}>Zoom</span>
          </div>
          <div className={styles.item}>
            <div className={styles.slider} ref={sliderRef}>
              <div style={{ left: `${zoomPos}px` }} className={styles.point} onMouseDown={handleMouseDown} />
            </div>
          </div>
          <span className={styles.value}>{`${Math.round(zoomValue * 100)}%`}</span>
        </div>
        {/* <div className={styles.tools}> */}
        {/*  <div className={styles.tool}> */}
        {/*    <img className={styles.image} src={cropRatio} alt='Ratio' /> */}
        {/*    <span className={styles.title}>Ratio</span> */}
        {/*  </div> */}
        {/*  {proportionElement('Current')} */}
        {/*  {proportionElement('Free')} */}
        {/*  {proportionElement('Square')} */}
        {/*  {proportionElement('Product')} */}
        {/*  {orientationElement('Horizontal')} */}
        {/*  {orientationElement('Vertical')} */}
        {/* </div> */}
      </div>
    )
  );
};
export default CropZoomPanel;

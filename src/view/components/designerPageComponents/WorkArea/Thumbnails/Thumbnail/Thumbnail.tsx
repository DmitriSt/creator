import React, { CSSProperties, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Canvas from '../../../../../../business/elements/Canvas';
import designer from '../../../../../../business/elements/Designer';
import { IPage } from '../../../../../../business/interfaces/interfaces';
import CONSTS from '../../../../../../models/constants/consts';
import { generateStrokeWidth } from '../../../../../helpers/utils';
import { updateDesigner } from '../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../stores/store';
import ElementSwitcher from '../../Canvas/elements/ElementSwitcher/ElementSwitcher';
import styles from './thumbnail.module.scss';

type ThumbnailPropsType = {
  pageIndex: number;
  page: IPage;
  canvasIndex: number;
  canvas: Canvas;
};

const Thumbnail = ({ pageIndex, page, canvasIndex, canvas }: ThumbnailPropsType) => {
  const dispatch = useDispatch();

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);

  const isBgTransparent = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[pageIndex]?.canvases[canvasIndex].backgroundOptions.isTransparent
  );

  const canvasElements = useCallback(
    (canvas: Canvas) =>
      canvas.elements.map((element) => <ElementSwitcher key={element.id} element={element} thumbnail />),
    [canvas]
  );

  const active = useMemo(() => {
    if (activePage === pageIndex && activeCanvas === canvasIndex) {
      return styles.active;
    }
    if (canvas.disabled) {
      return styles.disabled;
    }
    return undefined;
  }, [activeCanvas, activePage, pageIndex, canvasIndex, canvas.disabled]);

  const thumbWrapperStyle = useMemo(() => `${styles.thumbWrapper} ${!canvas.disabled && styles.pointer}`, [
    canvas.disabled,
  ]);

  const positionOnPage = useMemo((): CSSProperties => {
    const coefficientW = page.width / CONSTS.thumbnails.MAX_WIDTH;
    const coefficientH = page.height / CONSTS.thumbnails.MAX_HEIGHT;
    const top = canvas.top / coefficientH;
    const left = canvas.left / coefficientW;
    let isHasPositions = false;
    page.canvases.forEach((canvas) => {
      if (canvas.left || canvas.top) isHasPositions = true;
    });
    if (isHasPositions) {
      return {
        top: `${top - 5}px`,
        left: `${left - 5}px`,
      };
    }
    return {
      position: 'relative',
    };
  }, [page, canvas]);

  const widthOnPage = () => {
    const coefficient = page.width / CONSTS.thumbnails.MAX_WIDTH;
    let isHasPositions = false;
    page.canvases.forEach((canvas) => {
      if (canvas.left || canvas.top) isHasPositions = true;
    });
    if (isHasPositions) return canvas.width / coefficient;
    return CONSTS.thumbnails.MAX_WIDTH;
  };

  const heightOnPage = () => {
    const coefficient = page.height / CONSTS.thumbnails.MAX_HEIGHT;
    let isHasPositions = false;
    page.canvases.forEach((canvas) => {
      if (canvas.left || canvas.top) isHasPositions = true;
    });
    if (isHasPositions) return canvas.height / coefficient;
    return canvas.height > CONSTS.thumbnails.MAX_WIDTH
      ? `${(canvas.height * CONSTS.thumbnails.MAX_WIDTH) / canvas.width}px`
      : canvas.height;
  };

  const handleClick = () => {
    if (canvas.disabled) return;
    if (activeCanvas !== canvasIndex || activePage !== pageIndex) {
      designer.activePage = pageIndex;
      designer.activeCanvas = canvasIndex;
      dispatch(updateDesigner(designer));
    }
  };

  const THUMBS_CLIPPATH_ID = `thumbnail-${canvasIndex}`;

  const transparentBgBorder = useMemo(() => {
    if (isBgTransparent) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const stroke = generateStrokeWidth(canvasWidth, canvasHeight);
      return (
        <g className={styles.bleedLines}>
          <rect
            x='0'
            y='0'
            width='100%'
            height='100%'
            strokeDasharray={`${stroke},${stroke}`}
            strokeWidth={stroke}
            stroke='#42708a'
            fillOpacity='0'
          />
        </g>
      );
    }
    return null;
  }, [isBgTransparent, canvas]);

  const thumb = useMemo(() => {
    const isTransparent = canvas.disabled || isBgTransparent;
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        clipPath={`url(#${THUMBS_CLIPPATH_ID})`}
        style={{
          backgroundColor: isTransparent ? 'transparent' : 'white',
          maxWidth: widthOnPage(),
          height: heightOnPage(),
        }}
      >
        <defs>
          <clipPath id={THUMBS_CLIPPATH_ID}>
            <rect x={0} y={0} width='100%' height='100%' />
          </clipPath>
        </defs>
        {canvasElements(canvas)}
        {!canvas.disabled && transparentBgBorder}
      </svg>
    );
  }, [canvasElements, active, pageIndex, canvasIndex]);

  return (
    <div className={`${styles.thumb} ${active}`} style={positionOnPage}>
      <div className={thumbWrapperStyle} onClick={handleClick}>
        {thumb}
      </div>
      {/* <span
        className={titleStyle}
        onClick={handleClick}
        style={{
          maxWidth: CONSTS.thumbnails.MAX_WIDTH,
        }}
      >
        {canvas.name}
      </span> */}
    </div>
  );
};

export default Thumbnail;

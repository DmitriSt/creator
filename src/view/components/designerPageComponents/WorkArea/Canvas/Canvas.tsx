import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useResizeDetector } from 'react-resize-detector';

import BaseElement from '../../../../../business/elements/BaseElement';
import designer from '../../../../../business/elements/Designer';
import Image from '../../../../../business/elements/Image';
import Text from '../../../../../business/elements/Text';
import { IDimension } from '../../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../../models/constants/designer';
import { generateStrokeWidth } from '../../../../helpers/utils';
import {
  setCoefficient,
  setImagesOnCanvas,
  setStatus,
  updateDesigner,
} from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import styles from './canvas.module.scss';
import ElementSwitcher from './elements/ElementSwitcher/ElementSwitcher';
import CropLayer from './layers/CropLayer/CropLayer';
import TextLayer from './layers/TextLayer/TextLayer';
import CropSelector from './selectors/CropSelector/CropSelector';
import ResizeSelector from './selectors/ResizeSelector/ResizeSelector';

const Canvas = () => {
  const dispatch = useDispatch();

  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const isShowPreview = useSelector((state: RootStateType) => state.designerState.designer.isShowPreview);

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  // const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const canvases = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.pages[activePage]?.canvases
  );

  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const isBgTransparent = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas]?.backgroundOptions.isTransparent
  );

  const isBGEnter = useSelector((state: RootStateType) => state.designerState.tabBar.isBGEnter);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const editingLayerRef = useRef<SVGSVGElement>(null);
  const prevZoomValue = useRef(1);

  const [dimensions, setDimensions] = useState<IDimension>({
    width: 0,
    height: 0,
  });

  const [initialDimensions, setInitialDimensions] = useState<IDimension>({
    width: 0,
    height: 0,
  });

  const handleEscClick = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      designer.clearSelectedElements();
      dispatch(updateDesigner(designer));
    }
  };

  useEffect(() => {
    const images = designer.getCurrentCanvas()?.elements.filter((element) => element instanceof Image);
    if (images) dispatch(setImagesOnCanvas(images.length));
  }, [activePage, activeCanvas, canvases[activeCanvas]]);

  useEffect(() => {
    return () => {
      prevZoomValue.current = zoom;
    };
  }, [zoom]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscClick);
    return () => {
      document.removeEventListener('keydown', handleEscClick);
    };
  }, []);

  const canvas = useMemo(() => canvases && canvases[activeCanvas], [canvases, activeCanvas]);

  const canvasBounds = useMemo<IDimension>(() => {
    if (!canvas || !canvas.width || !canvas.height) {
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: canvas.width * zoom,
      height: canvas.height * zoom,
    };
  }, [canvas, zoom]);

  const ratio = useMemo(() => {
    const ratio = canvasBounds.height / canvasBounds.width;
    return ratio || 1;
  }, [canvasBounds]);

  const defineCanvasSize = (
    initialWidth: number,
    initialHeight: number,
    refRatio: number,
    factor: number
  ): IDimension => {
    const width = (refRatio > ratio ? initialWidth : initialHeight / (ratio || 1)) * factor;
    const height = (refRatio < ratio ? initialHeight : initialWidth * (ratio || 1)) * factor;
    if (width >= initialWidth || height >= initialHeight) {
      return defineCanvasSize(initialWidth, initialHeight, refRatio, factor - 0.05);
    }
    return {
      width,
      height,
    };
  };

  const onResize = useCallback(
    (width?: number, height?: number) => {
      if (!width || !height) return;
      if (zoom === 1) {
        if (
          width > canvasBounds.width &&
          height > canvasBounds.height &&
          (dimensions.width !== canvasBounds.width || dimensions.height !== canvasBounds.height)
        ) {
          setDimensions({
            width: canvasBounds.width,
            height: canvasBounds.height,
          });
          return;
        }
        if (width < canvasBounds.width || height < canvasBounds.height) {
          setDimensions(defineCanvasSize(width, height, height / width, 1));
          return;
        }
      }
      const refRatio = height / width;
      if (width < canvasBounds.width || height < canvasBounds.height) {
        const w = refRatio > ratio ? width : height / ratio;
        const h = refRatio < ratio ? height : width * ratio;
        setDimensions({
          width: zoom === 1 ? w : initialDimensions.width * zoom,
          height: zoom === 1 ? h : initialDimensions.height * zoom,
        });
      }
    },
    [canvasBounds, zoom, initialDimensions]
  );

  useEffect(() => {
    if (dimensions.width / canvasBounds.width !== Infinity) {
      dispatch(setCoefficient(dimensions.width / canvasBounds.width));
    }
  }, [dimensions.width, canvasBounds]);

  const { width, height } = useResizeDetector({
    refreshMode: 'throttle',
    refreshRate: 15,
    targetRef: wrapperRef,
    onResize,
  });

  useEffect(() => {
    let timer: null | NodeJS.Timeout = null;
    function getCanvasSize() {
      const canvas = document.getElementById('canvas-main');
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      setInitialDimensions({ width, height });
    }
    if (zoom === 1) {
      timer = setTimeout(() => getCanvasSize(), 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [width, height, zoom]);

  const initial = useMemo<IDimension>(() => {
    if (zoom !== 1) {
      return {
        width: initialDimensions.width * zoom,
        height: initialDimensions.height * zoom,
      };
    }
    const refWidth = width || canvasBounds.width;
    const refHeight = height || canvasBounds.height;
    const refRatio = refHeight / refWidth;
    const newWidth = Math.min(refWidth, canvasBounds.width);
    const newHeight = Math.min(refHeight, canvasBounds.height);
    return defineCanvasSize(newWidth, newHeight, refRatio, 1);
  }, [canvasBounds, ratio, zoom]);

  useEffect(() => {
    setDimensions({
      ...dimensions,
      ...initial,
    });
  }, [initial]);

  const handleSelection = (e: React.MouseEvent) => {
    const canvas = document.getElementById('canvas-main');
    if (
      canvasRef.current &&
      canvasRef.current.contains(e.target as HTMLElement) &&
      e.target !== canvas &&
      e.target !== canvasRef.current
    ) {
      e.stopPropagation();
    }
  };

  const layeredStatuses = [ElementStatuses.CroppingMode, ElementStatuses.TextEditing];

  const isElementSelected = (element: BaseElement) =>
    selectedElements.map((element) => element.id).includes(element.id);

  const filterElements = (element: BaseElement) => {
    const mainCondition = !(layeredStatuses.includes(status) && isElementSelected(element));
    if (isShowPreview && element.elementName === 'Text') {
      const textElement = element as Text;
      return mainCondition && !textElement.placeholder;
    }
    return mainCondition;
  };

  const elements = useMemo(
    () =>
      canvas?.elements
        .filter(filterElements)
        .map((element) => <ElementSwitcher key={element.id} element={element} thumbnail={false} />),
    [canvas, status, zoom, isShowPreview]
  );

  const style = useMemo(
    () => ({
      width: dimensions.width || canvasBounds.width,
      height: dimensions.height || canvasBounds.height,
    }),
    [canvasBounds, dimensions.width, dimensions.height, zoom]
  );

  const selector = useMemo(() => {
    if (status === ElementStatuses.CroppingMode) return <CropSelector />;
    return <ResizeSelector />;
  }, [status]);

  const handleLayerMouseDown = (e: React.MouseEvent) => {
    const target = e.target as SVGSVGElement;
    if (target === editingLayerRef.current) {
      dispatch(setStatus(ElementStatuses.Stable));
    }
  };

  const bleed = useMemo(() => {
    const currentCanvas = designer.getCurrentCanvas();
    if (!currentCanvas) return null;
    const bleedWidth = (currentCanvas.bleed?.width || 0) * zoom;
    const bleedHeight = (currentCanvas.bleed?.height || 0) * zoom;
    const canvasWidth = currentCanvas.width * zoom;
    const canvasHeight = currentCanvas.height * zoom;
    const color = 'rgba(255, 0, 0, 0.1)';
    const STROKE_WIDTH = 2;
    return (
      <g className={styles.bleed}>
        <line
          id='bleedTopLineS'
          x1='0'
          y1={bleedHeight / 2}
          x2={canvasWidth}
          y2={bleedHeight / 2}
          stroke={color}
          strokeWidth={bleedHeight}
        />
        <line
          id='bleedLeftLineS'
          x1={bleedWidth / 2}
          y1={bleedHeight}
          x2={bleedWidth / 2}
          y2={canvasHeight - bleedHeight}
          stroke={color}
          strokeWidth={bleedWidth}
        />
        <line
          id='bleedRightLineS'
          x1={canvasWidth - bleedWidth / 2}
          y1={bleedHeight}
          x2={canvasWidth - bleedWidth / 2}
          y2={canvasHeight - bleedHeight}
          stroke={color}
          strokeWidth={bleedWidth}
        />
        <line
          id='bleedBottomLineS'
          x1='0'
          y1={canvasHeight - bleedHeight / 2}
          x2={canvasWidth}
          y2={canvasHeight - bleedHeight / 2}
          stroke={color}
          strokeWidth={bleedHeight}
        />
        <rect
          x={bleedWidth}
          y={bleedHeight}
          width={canvasWidth - bleedWidth * 2}
          height={canvasHeight - bleedHeight * 2}
          stroke='#FF0000'
          strokeWidth={STROKE_WIDTH}
          fillOpacity='0'
        />
      </g>
    );
  }, [activeCanvas, activePage, zoom]);

  const transparentBgBorder = useMemo(() => {
    if (isBgTransparent) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const stroke = generateStrokeWidth(canvasWidth, canvasHeight) * zoom;
      return (
        <g className={styles.bleed}>
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
  }, [isBgTransparent, canvas, zoom]);

  const canvasRender = useMemo(() => {
    const CANVAS_CLIPPATH_ID = 'canvas-clippath';
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${canvasBounds.width} ${canvasBounds.height}`}
        className={styles.contentLayer}
        id='canvas-main'
        style={style}
        clipPath={`url(#${CANVAS_CLIPPATH_ID})`}
      >
        <defs>
          <clipPath id={CANVAS_CLIPPATH_ID}>
            <rect x={0} y={0} width='100%' height='100%' />
          </clipPath>
        </defs>
        {elements}
        {transparentBgBorder}
        {bleed}
      </svg>
    );
  }, [elements, style]);

  const layersRender = useMemo(
    () =>
      layeredStatuses.includes(status) && (
        <svg
          ref={editingLayerRef}
          className={styles.editingLayer}
          viewBox={`0 0 ${canvasBounds.width} ${canvasBounds.height}`}
          style={style}
          onMouseDown={handleLayerMouseDown}
        >
          {status === ElementStatuses.CroppingMode && <CropLayer />}
          {status === ElementStatuses.TextEditing && <TextLayer />}
        </svg>
      ),
    [status, style, zoom]
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={canvasRef} className={styles.canvas} onMouseDown={handleSelection}>
        {zoom !== 1 && <div style={{ width: dimensions.width, height: dimensions.height }} />}
        {isBGEnter && <div className={styles.activeWrapper} style={style} />}
        {canvasRender}
        {layersRender}
        <div className={styles.selectorsLayer} style={style}>
          {selector}
        </div>
        {/* <canvas */}
        {/*  className={styles.temp} */}
        {/*  id='canvas-temp' */}
        {/*  width={dimensions.width / coefficient} */}
        {/*  height={dimensions.height / coefficient} */}
        {/*  style={{ width: dimensions.width, height: dimensions.height }} */}
        {/* /> */}
      </div>
    </div>
  );
};

export default Canvas;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useResizeDetector } from 'react-resize-detector';

import { Axes } from '../../../../../models/constants/designer';
import { getElementBounds } from '../../../../helpers/designer';
import { RootStateType } from '../../../../stores/store';
import Ruler from './Ruler/Ruler';

const rulerHeight = 22;

const RulerWrapper = () => {
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const isActiveTab = !!useSelector((state: RootStateType) => state.designerState.tabBar.activeTab);

  const [topIndent, setTopIndent] = useState(0);
  const [leftIndent, setLeftIndent] = useState(0);

  const wrapperRef = useRef<HTMLElement>(null);
  const workAreaRectRef = useRef<DOMRect>(null);
  const canvasRectRef = useRef<DOMRect>(null);
  const prevCoef = useRef<number>(null);

  const defineIndents = (scrollLeft = 0, scrollTop = 0) => {
    const canvasBounds = getElementBounds('canvas-main');
    const workAreaBounds = workAreaRectRef.current;
    if (canvasBounds && workAreaBounds) {
      const left = canvasBounds.left - workAreaBounds.left - rulerHeight - scrollLeft;
      const top = canvasBounds.top - workAreaBounds.top - rulerHeight - scrollTop;
      setTopIndent(top);
      setLeftIndent(left);
      canvasRectRef.current = canvasBounds;
    }
  };

  useEffect(() => {
    const workAreaBounds = getElementBounds('work-area');
    workAreaRectRef.current = workAreaBounds;
  }, [isActiveTab]);

  const onResize = useCallback(
    (width?: number, height?: number) => {
      if (
        width &&
        height &&
        coefficient === prevCoef.current &&
        wrapperRef.current &&
        wrapperRef.current.scrollTop === 0 &&
        wrapperRef.current.scrollLeft === 0
      ) {
        defineIndents();
      }
      prevCoef.current = coefficient;
    },
    [coefficient, prevCoef.current]
  );

  useResizeDetector({
    refreshMode: 'throttle',
    refreshRate: 15,
    targetRef: wrapperRef,
    onResize,
  });

  useEffect(() => {
    if (!wrapperRef.current) {
      const workArea = document.getElementById('scrollable_work_area');
      wrapperRef.current = workArea;
    }
    function handleScroll() {
      defineIndents(wrapperRef.current.scrollLeft, wrapperRef.current.scrollTop);
    }
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('scroll', handleScroll);
    }
    if (wrapperRef.current && (wrapperRef.current.scrollTop !== 0 || wrapperRef.current.scrollLeft !== 0)) {
      defineIndents(wrapperRef.current.scrollLeft, wrapperRef.current.scrollTop);
    } else {
      defineIndents();
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [zoom, coefficient]);

  return (
    <>
      <Ruler indent={leftIndent} />
      <Ruler orientation={Axes.Vertical} indent={topIndent} />
    </>
  );
};

export default RulerWrapper;

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveTab, setTabBarWidth } from '../../../../../../stores/designerStore/tabBar/tabBarActions';
import styles from './resizer.module.scss';

type ResizerPropsType = {
  reference: React.RefObject<HTMLElement>;
  children?: ReactNode | string;
  className?: string;
};

const Resizer = ({ reference, children, className }: ResizerPropsType) => {
  const dispatch = useDispatch();

  const resizerRef = useRef<HTMLDivElement>(null);

  const [isMoving, setMoving] = useState(false);

  let prevClientX = 0;
  let refWidth = 0;

  useEffect(() => {
    const component = reference.current;
    if (component) {
      component.style.position = 'relative';
    }
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    const component = reference.current;
    const resizer = resizerRef.current;
    const OFFSET = 150;
    if (isMoving && component && resizer && resizer.parentElement) {
      const resizerParentBounds = resizer.parentElement.getBoundingClientRect();
      if (e.clientX < resizerParentBounds.left + OFFSET) {
        component.style.display = 'none';
        dispatch(setActiveTab(null));
      } else {
        component.style.width = `${refWidth + e.clientX - prevClientX}px`;
        dispatch(setTabBarWidth(refWidth + e.clientX - prevClientX));
      }
    }
  };

  const handleMouseUp = () => {
    document.body.removeEventListener('mousemove', handleMouseMove, false);
    document.body.removeEventListener('mouseup', handleMouseUp, false);
    setMoving(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.body.addEventListener('mousemove', handleMouseMove, false);
    document.body.addEventListener('mouseup', handleMouseUp, false);
    prevClientX = e.clientX;
    const component = reference.current;
    if (component) {
      refWidth = component.getBoundingClientRect().width;
    }
  };

  const enableMoving = () => {
    setMoving(true);
  };

  return (
    <div
      ref={resizerRef}
      className={`${styles.resizer} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={enableMoving}
    >
      {children}
    </div>
  );
};

export default Resizer;

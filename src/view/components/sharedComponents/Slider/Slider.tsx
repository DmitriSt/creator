import throttle from 'lodash.throttle';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { between } from '../../../helpers/utils';
import styles from './slider.module.scss';

type SliderPropsType = {
  min: number;
  max: number;
  prefix?: string;
  postfix?: string;
  initialValue?: number;
  value?: number;
  width?: number;
  valueWidth?: number;
  resetOnDoubleClick?: boolean;
  formatter?: (value: number) => number;
  onChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;
};

function valueToPosition(value: number, min: number, max: number, limit: number) {
  return between((limit / (max - min)) * (value - min), 0, limit);
}

const Slider = ({
  min,
  max,
  width = 200,
  valueWidth,
  formatter,
  prefix,
  postfix,
  initialValue,
  value,
  resetOnDoubleClick = true,
  onChange,
  onAfterChange,
}: SliderPropsType) => {
  const [position, setPosition] = useState(null);
  const [currentValue, setCurrentValue] = useState(0);

  const prevClientX = useRef(0);
  const prevValue = useRef(0);
  const currValue = useRef(0);

  useLayoutEffect(() => {
    const ref = value ?? initialValue;
    const newValue = Math.round(ref === null ? (min + max) / 2 : between(ref, min, max));
    setCurrentValue(newValue);
    setPosition(valueToPosition(newValue, min, max, width));
    prevValue.current = newValue;
    currValue.current = newValue;
  }, []);

  useLayoutEffect(() => {
    if (position === null) return;
    const newValue = between(Math.round(((max - min) * position) / width + min), min, max);
    setCurrentValue(newValue);
    currValue.current = newValue;
  }, [position]);

  useEffect(() => {
    if (onChange && prevValue.current !== currValue.current) onChange(currentValue);
  }, [currentValue]);

  const throttledMove = throttle((e: MouseEvent) => {
    if (position === null) return;
    setPosition(between(position + e.clientX - prevClientX.current, 0, width));
  }, 20);

  const handleMouseMove = (e: MouseEvent) => {
    throttledMove(e);
  };

  const handleMouseUp = () => {
    document.body.removeEventListener('mousemove', handleMouseMove, false);
    document.body.removeEventListener('mouseup', handleMouseUp, false);
    if (onAfterChange && prevValue.current !== currValue.current) onAfterChange(currValue.current);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.body.addEventListener('mousemove', handleMouseMove, false);
    document.body.addEventListener('mouseup', handleMouseUp, false);
    prevClientX.current = e.clientX;
    prevValue.current = currentValue;
  };

  const handleDoubleClick = () => {
    if (!resetOnDoubleClick) return;
    setCurrentValue(initialValue);
    setPosition(valueToPosition(initialValue, min, max, width));
  };

  const valueSpanStyle = useMemo<React.CSSProperties>(
    () => ({
      width: valueWidth || 'auto',
      maxWidth: valueWidth || 'auto',
    }),
    [valueWidth]
  );

  return (
    <div className={styles.slider}>
      <div className={styles.track} style={{ width: `${width}px` }}>
        <div
          style={{ left: `${position || 0}px` }}
          className={styles.point}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />
      </div>
      <span className={styles.value} style={valueSpanStyle}>
        {prefix}
        {formatter ? formatter(currentValue) : currentValue}
        {postfix}
      </span>
    </div>
  );
};

export default Slider;

import React from 'react';

import rulerStyles from '../ruler.module.scss';

type PulerUnitPropsType = {
  value: number;
  isVertical?: boolean;
  size: number;
};

const RulerUnit = ({ value, isVertical, size }: PulerUnitPropsType) => {
  return (
    <div
      className={`${rulerStyles.item} ${isVertical ? rulerStyles.item_vertical : rulerStyles.item_horizontal}`}
      style={isVertical ? { height: size } : { width: size }}
    >
      <span
        className={`${rulerStyles.value} ${isVertical ? rulerStyles.value_vertical : rulerStyles.value_horizontal}`}
      >
        {value}
      </span>
    </div>
  );
};

export default RulerUnit;

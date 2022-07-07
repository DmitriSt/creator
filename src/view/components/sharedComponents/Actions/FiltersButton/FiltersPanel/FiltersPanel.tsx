import isEqual from 'lodash.isequal';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../business/elements/BaseElement';
import designer from '../../../../../../business/elements/Designer';
import * as Guard from '../../../../../../business/Guard';
import { IWithFilters, IWithFiltersProperties } from '../../../../../../business/interfaces/featuresInterfaces';
import consts from '../../../../../../models/constants/consts';
import { defaultColorPresets } from '../../../../../../models/constants/designer';
import { commandChangeFilters } from '../../../../../helpers/commands';
import { updateDesigner } from '../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../stores/store';
import Colorizer from '../../../Colorizer/Colorizer';
import Slider from '../../../Slider/Slider';
import ActionButton from '../../ActionButton/ActionButton';
import styles from './filtersPanel.module.scss';

const dropStroke = (enabled: boolean) => (
  <svg width='17' height='23' viewBox='0 0 17 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      fill={enabled ? consts.designer.BRAND_COLOR : '#657176'}
      d='M8.5,23C3.8,23,0,19,0,14.1c0-1.1,0.4-2.6,1.3-4.3C2,8.4,3,6.9,4.2,5.2C5.1,4,6.1,2.7,7.2,1.5
      C7.4,1.3,7.6,1,7.7,0.8L8.5,0l0.8,0.9C9.4,1,9.6,1.3,9.8,1.5c1.1,1.2,2,2.5,2.9,3.7C14,6.9,15,8.4,15.7,9.8c0.9,1.7,1.3,3.2,1.3,4.3
      C17,19,13.2,23,8.5,23z M8.5,3C7.6,4.1,6.6,5.3,5.9,6.4C4.7,8,3.8,9.4,3.1,10.7C2.2,12.5,2,13.5,2,14.1C2,17.9,4.9,21,8.5,21
      s6.5-3.1,6.5-6.9c0-0.6-0.2-1.6-1.1-3.4c-0.7-1.3-1.6-2.7-2.8-4.3C10.4,5.3,9.4,4.1,8.5,3z'
    />
  </svg>
);

const dropHalf = (enabled: boolean) => (
  <svg width='17' height='23' viewBox='0 0 17 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      fill={enabled ? consts.designer.BRAND_COLOR : '#657176'}
      d='M15.7,9.8C15,8.4,14,6.9,12.8,5.2C11.9,4,10.9,2.7,9.8,1.5C9.6,1.3,9.4,1,9.3,0.8L8.5,0L7.7,0.8
      C7.6,1,7.4,1.3,7.2,1.5C6.1,2.7,5.1,4,4.2,5.2C3,6.9,2,8.4,1.3,9.8C0.4,11.5,0,12.9,0,14.1C0,19,3.8,23,8.5,23c4.7,0,8.5-4,8.5-8.9
      C17,12.9,16.6,11.5,15.7,9.8z M8.5,21C8.5,21,8.5,21,8.5,21C4.9,21,2,17.9,2,14.1c0-0.6,0.2-1.6,1.1-3.4C3.8,9.4,4.7,8,5.9,6.4
      C6.8,5,7.8,3.8,8.5,3c0,0,0,0,0,0V21z'
    />
  </svg>
);

type LimitsType = {
  refSlider: number;
  minSlider: number;
  maxSlider: number;
  refValue: number;
  minValue: number;
  maxValue: number;
};

function sliderToValue(slider: number, limits: LimitsType): number {
  if (slider === limits.refSlider) return limits.refValue;
  const ratio =
    slider < limits.refSlider
      ? (limits.refValue - limits.minValue) / (limits.refSlider - limits.minSlider)
      : (limits.maxValue - limits.refValue) / (limits.maxSlider - limits.refSlider);
  return +((slider - limits.refSlider) * ratio + limits.refValue).toFixed(2);
}

function valueToSlider(value: number, limits: LimitsType): number {
  if (value === limits.refValue) return limits.refSlider;
  const ratio =
    value < limits.refValue
      ? (limits.refSlider - limits.minSlider) / (limits.refValue - limits.minValue)
      : (limits.maxSlider - limits.refSlider) / (limits.maxValue - limits.refValue);
  return Math.round((value - limits.refValue) * ratio + limits.refSlider);
}

const contrast = {
  refSlider: consts.filters.DEFAULT_CONTRAST_SLIDER,
  minSlider: consts.filters.MIN_CONTRAST_SLIDER,
  maxSlider: consts.filters.MAX_CONTRAST_SLIDER,
  refValue: consts.filters.DEFAULT_CONTRAST,
  minValue: consts.filters.MIN_CONTRAST,
  maxValue: consts.filters.MAX_CONTRAST,
  toValue(slider: number): number {
    return sliderToValue(slider, this);
  },
  toSlider(value: number): number {
    return valueToSlider(value, this);
  },
};

const brightness = {
  refSlider: consts.filters.DEFAULT_BRIGHTNESS_SLIDER,
  minSlider: consts.filters.MIN_BRIGHTNESS_SLIDER,
  maxSlider: consts.filters.MAX_BRIGHTNESS_SLIDER,
  refValue: consts.filters.DEFAULT_BRIGHTNESS,
  minValue: consts.filters.MIN_BRIGHTNESS,
  maxValue: consts.filters.MAX_BRIGHTNESS,
  toValue(slider: number): number {
    return sliderToValue(slider, this);
  },
  toSlider(value: number): number {
    return valueToSlider(value, this);
  },
};

const blur = {
  refSlider: consts.filters.DEFAULT_BLUR_SLIDER,
  minSlider: consts.filters.MIN_BLUR_SLIDER,
  maxSlider: consts.filters.MAX_BLUR_SLIDER,
  refValue: consts.filters.DEFAULT_BLUR,
  minValue: consts.filters.MIN_BLUR,
  maxValue: consts.filters.MAX_BLUR,
  toValue(slider: number): number {
    return sliderToValue(slider, this);
  },
  toSlider(value: number): number {
    return valueToSlider(value, this);
  },
};

const FiltersDropdown = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.selectedElements
  );

  const element = useMemo(() => selectedElements.length && selectedElements[0], [selectedElements]);

  const [isColorizerOpen, setColorizerOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<IWithFiltersProperties>(Guard.isFilterable(element) ? element.filters : null);

  const prevFilters = useRef<IWithFiltersProperties>(filters);
  const currFilters = useRef<IWithFiltersProperties>(filters);

  useLayoutEffect(() => {
    currFilters.current = filters;
  }, [filters]);

  useEffect(() => {
    if (!Guard.isFilterable(element) || isEqual(filters, element.filters)) return;
    const designerElement = designer.getElementById(element.id) as BaseElement & IWithFilters;
    designerElement.filters = filters;
    dispatch(updateDesigner(designer));
  }, [filters]);

  const saveFilters = () => {
    if (!element || isEqual(prevFilters.current, currFilters.current)) return;
    commandChangeFilters(dispatch, prevFilters.current, currFilters.current, element.id);
    prevFilters.current = currFilters.current;
  };

  const handleGrayscaleClick = () => {
    const newFilters = { ...filters, isGrayscale: !filters.isGrayscale };
    setFilters(newFilters);
    commandChangeFilters(dispatch, prevFilters.current, newFilters, element.id);
    prevFilters.current = newFilters;
  };

  const handleInvertClick = () => {
    const newFilters = { ...filters, isInverted: !filters.isInverted };
    setFilters(newFilters);
    commandChangeFilters(dispatch, prevFilters.current, newFilters, element.id);
    prevFilters.current = newFilters;
  };

  const handleColorizerChange = (color: string) => {
    setFilters((filter) => ({ ...filter, colorization: color }));
  };

  const handleContrastChange = (slider: number) => {
    setFilters((filter) => ({ ...filter, contrast: contrast.toValue(slider) }));
  };

  const handleBrightnessChange = (slider: number) => {
    setFilters((filter) => ({ ...filter, brightness: brightness.toValue(slider) }));
  };

  const handleBlurChange = (slider: number) => {
    setFilters((filter) => ({ ...filter, blur: blur.toValue(slider) }));
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const activeButtonStyle: React.CSSProperties = {
    color: '#42708a',
    fontWeight: 'bold',
  };

  const handleColorizerClick = () => {
    setColorizerOpen((isOpen) => !isOpen);
  };

  const handleColorizerClose = () => {
    setColorizerOpen(false);
  };

  const colorizer = (
    <Colorizer
      initialColor={filters?.colorization}
      presets={['', ...defaultColorPresets]}
      show={isColorizerOpen}
      side='bottom'
      onChange={handleColorizerChange}
      onAfterChange={saveFilters}
      onClose={handleColorizerClose}
    />
  );

  return (
    filters && (
      <section className={styles.filters} onClick={stopPropagation}>
        <div className={styles.toggles}>
          <div className={styles.toggle}>
            <ActionButton
              style={filters?.isGrayscale && activeButtonStyle}
              icon={dropStroke(filters?.isGrayscale)}
              value='Make grayscale'
              onClick={handleGrayscaleClick}
            />
          </div>
          <div className={styles.toggle}>
            <ActionButton
              style={filters?.isInverted && activeButtonStyle}
              icon={dropHalf(filters?.isInverted)}
              value='Invert colors'
              onClick={handleInvertClick}
            />
          </div>
          <div className={styles.toggle}>
            <ActionButton icon={colorizer} value='Colorize' onClick={handleColorizerClick} />
          </div>
        </div>
        <div className={styles.sliders}>
          <div className={styles.wrapper}>
            <Slider
              valueWidth={30}
              min={consts.filters.MIN_CONTRAST_SLIDER}
              max={consts.filters.MAX_CONTRAST_SLIDER}
              initialValue={consts.filters.DEFAULT_CONTRAST_SLIDER}
              value={contrast.toSlider(filters.contrast)}
              onChange={handleContrastChange}
              onAfterChange={saveFilters}
            />
            <span className={styles.description}>Contrast</span>
          </div>
          <div className={styles.wrapper}>
            <Slider
              valueWidth={30}
              min={consts.filters.MIN_BRIGHTNESS_SLIDER}
              max={consts.filters.MAX_BRIGHTNESS_SLIDER}
              initialValue={consts.filters.DEFAULT_BRIGHTNESS_SLIDER}
              value={brightness.toSlider(filters.brightness)}
              onChange={handleBrightnessChange}
              onAfterChange={saveFilters}
            />
            <span className={styles.description}>Brightness</span>
          </div>
          <div className={styles.wrapper}>
            <Slider
              valueWidth={30}
              min={consts.filters.MIN_BLUR_SLIDER}
              max={consts.filters.MAX_BLUR_SLIDER}
              initialValue={consts.filters.DEFAULT_BLUR_SLIDER}
              value={blur.toSlider(filters.blur)}
              onChange={handleBlurChange}
              onAfterChange={saveFilters}
            />
            <span className={styles.description}>Blur</span>
          </div>
        </div>
      </section>
    )
  );
};

export default FiltersDropdown;

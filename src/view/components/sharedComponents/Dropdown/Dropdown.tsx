import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

import { IExtendedFilterConfigItem, IFilterConfigItem } from '../../../../models/commonPage.models';
import styles from './dropdown.module.scss';
import DropdownList from './DropdownList/DropdownList';

type DropdownPropsType = {
  items: IExtendedFilterConfigItem[];
  onChange?: (selected: IExtendedFilterConfigItem | null) => void;
  className?: string;
  style?: CSSProperties;
  description: string;
  initialValue?: IExtendedFilterConfigItem | null;
  isReset?: boolean;
};

type DependentDropdownPropsType = {
  items: IExtendedFilterConfigItem[];
  onChange: (selected: IExtendedFilterConfigItem | null) => void;
  className?: string;
  description: string;
  selected: IExtendedFilterConfigItem | null;
  isReset?: boolean;
};

type DropdownRenderProps = {
  handleDropdown: () => void;
  handleSelect: (newSelected: IExtendedFilterConfigItem | null) => void;
  description: string;
  className?: string;
  titleStyle: string;
  style?: CSSProperties;
  selected?: IExtendedFilterConfigItem;
  fullItems: IExtendedFilterConfigItem[];
  isListShowed: boolean;
};

const resetItem: IFilterConfigItem = {
  text: 'Reset',
  value: 'reset_dropdown',
};

const layout = ({
  fullItems,
  isListShowed,
  className,
  handleSelect,
  style,
  titleStyle,
  handleDropdown,
  description,
  selected,
}: DropdownRenderProps) => (
  <div
    className={`${styles.wrapper} ${className}`}
    style={style}
    onClick={handleDropdown}
    data-selected={selected ? selected.text : description}
  >
    <div className={`${styles.item} ${className}`}>
      {selected && selected.icon ? (
        <div className={styles.selected_wrapper}>
          <img src={selected.icon} />
          <span className={titleStyle}>{selected.text}</span>
        </div>
      ) : (
        <span className={titleStyle}>{selected ? selected.text : description}</span>
      )}
      <div className={isListShowed ? styles.rotated : undefined}>
        <svg
          width='24'
          height='10'
          viewBox='0 0 24 10'
          fill='none'
          className='svg-path-stroke'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M2 2L12 8L22 2' strokeWidth='3' strokeLinecap='round' />
        </svg>
      </div>
    </div>
    {isListShowed && <DropdownList items={fullItems} callback={handleSelect} />}
  </div>
);

const Dropdown = ({
  items,
  onChange,
  className,
  style,
  initialValue,
  description,
  isReset = true,
}: DropdownPropsType) => {
  const [selected, setSelected] = useState(initialValue || null);
  const [isListShowed, setListShowed] = useState(false);
  const fullItems = isReset && selected ? [...items, resetItem] : items;

  useEffect(() => {
    if (initialValue && initialValue !== selected) {
      setSelected(initialValue);
    }
  }, [initialValue]);

  const handleDropdown = () => {
    setListShowed(!isListShowed);
  };

  const handleSelect = (newSelected: IExtendedFilterConfigItem | null) => {
    if (newSelected && newSelected.value === 'reset_dropdown') {
      setSelected(null);
      return;
    }
    if (newSelected && newSelected !== selected) {
      setSelected(newSelected);
    }
    setListShowed(false);
  };

  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected]);

  const titleStyle = useMemo(() => `${styles.title} ${selected ? '' : styles.inactive}`, [selected]);

  return layout({
    handleDropdown,
    handleSelect,
    titleStyle,
    fullItems,
    description,
    isListShowed,
    className,
    style,
    selected,
  });
};

const DependentDropdown = ({
  items,
  onChange,
  className,
  description,
  selected,
  isReset = true,
}: DependentDropdownPropsType) => {
  const [isListShowed, setListShowed] = useState(false);
  const fullItems = selected && isReset ? [...items, resetItem] : items;

  const handleDropdown = () => {
    setListShowed(!isListShowed);
  };

  const handleSelect = (newSelected: IExtendedFilterConfigItem | null) => {
    if (newSelected && newSelected.value === 'reset_dropdown') {
      onChange(null);
      return;
    }
    if (newSelected && newSelected !== selected) {
      onChange(newSelected);
    }
    setListShowed(false);
  };

  const titleStyle = useMemo(() => `${styles.title} ${selected ? '' : styles.inactive}`, [selected]);

  return layout({
    handleDropdown,
    handleSelect,
    titleStyle,
    fullItems,
    description,
    isListShowed,
    className,
    selected,
  });
};

export default Dropdown;
export { DependentDropdown };

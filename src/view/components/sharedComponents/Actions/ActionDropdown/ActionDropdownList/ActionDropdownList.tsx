import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';

import { ActionDropdownItemType } from '../ActionDropdown';
import styles from './actionDropdownList.module.scss';

interface ActionDropdownListPropsType {
  list: ActionDropdownItemType[];
  selected?: ActionDropdownItemType;
  listWidth?: number;
  listStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  iconStyle?: CSSProperties;
  onSelect?: (item: ActionDropdownItemType) => void;
}

const ActionDropdownList = ({
  list,
  selected,
  listWidth,
  listStyle,
  itemStyle,
  iconStyle,
  onSelect,
}: ActionDropdownListPropsType) => {
  const [focusIndex, setFocusIndex] = useState(-1);
  const [isVisible, setVisible] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
    if (!selected) return;
    const pos = list.findIndex((item) => item.name === selected.name);
    setFocusIndex(pos);
  }, []);

  useEffect(() => {
    if (!itemRef.current || !listRef.current) return;
    itemRef.current.style.backgroundColor = '#eef3f599';
    listRef.current.scrollTop =
      itemRef.current.getBoundingClientRect().top - listRef.current.getBoundingClientRect().top;
  }, [listRef?.current, itemRef?.current]);

  const handleSelect = (item: ActionDropdownItemType) => {
    if (onSelect) onSelect(item);
  };

  return (
    <div
      ref={listRef}
      className={styles.list}
      style={{ ...listStyle, width: listWidth, display: isVisible ? 'block' : 'none' }}
    >
      {list?.map((item, i) => (
        <div
          ref={i === focusIndex ? itemRef : null}
          key={uniqid()}
          className={styles.item}
          style={{ ...itemStyle, ...item?.itemStyle }}
          onClick={() => handleSelect(item)}
        >
          <div className={styles.icon} style={{ ...iconStyle, ...item?.iconStyle }}>
            {item.icon}
          </div>
          <span className={styles.name}>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ActionDropdownList;

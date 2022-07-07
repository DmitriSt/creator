import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import ActionButton from '../ActionButton/ActionButton';
import styles from './actionDropdown.module.scss';
import ActionDropdownList from './ActionDropdownList/ActionDropdownList';

export type ActionDropdownItemType = {
  name: string;
  icon?: ReactNode;
  itemStyle?: CSSProperties;
  iconStyle?: CSSProperties;
};

type ActionDropdownPropsType = {
  list?: ActionDropdownItemType[];
  children?: ReactNode;
  title?: string;
  fixedTitle?: boolean;
  selected?: ActionDropdownItemType;
  dropdownWidth?: number;
  icon?: ReactNode;
  iconOpened?: ReactNode;
  contentBefore?: string;
  contentAfter?: string;
  buttonIconAlign?: 'left' | 'right';
  listStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
  iconStyle?: CSSProperties;
  onChange?: (item: ActionDropdownItemType) => void;
};

const ActionDropdown = ({
  list,
  children,
  title,
  fixedTitle = false,
  selected,
  icon,
  iconOpened,
  onChange,
  buttonIconAlign = 'right',
  buttonStyle,
  listStyle,
  itemStyle,
  iconStyle,
  dropdownWidth,
  contentBefore,
  contentAfter,
}: ActionDropdownPropsType) => {
  const [isOpen, setOpen] = useState(false);
  const [isAllowed, setAllowed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActionDropdownItemType>(null);

  useLayoutEffect(() => {
    setSelectedItem(selected || (list && !title && !fixedTitle ? list[0] : null));
  }, [list, selected]);

  useEffect(() => {
    if (isOpen) setAllowed(true);
  }, [isOpen]);

  useEffect(() => {
    if (onChange && isAllowed) {
      onChange(selectedItem);
      setAllowed(false);
    }
  }, [selectedItem]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen((isOpen) => !isOpen);
  };

  const handleDropdown = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('mousedown', handleDropdown, true);
    return () => {
      document.body.removeEventListener('mousedown', handleDropdown, true);
    };
  }, []);

  const handleSelect = (item: ActionDropdownItemType) => {
    if (title) {
      onChange(item);
    } else {
      setSelectedItem(item);
    }
  };

  const inner = useMemo(
    () =>
      children ? (
        <div className={styles.children}>{children}</div>
      ) : (
        <ActionDropdownList
          listStyle={listStyle}
          iconStyle={iconStyle}
          itemStyle={itemStyle}
          selected={selected}
          listWidth={dropdownWidth}
          list={list}
          onSelect={handleSelect}
        />
      ),
    [children]
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper} onClick={handleClick}>
      <ActionButton
        iconAlign={buttonIconAlign}
        style={buttonStyle}
        icon={isOpen && iconOpened ? iconOpened : icon}
        value={`${contentBefore || ''}${selectedItem?.name || title}${contentAfter || ''}`}
      />
      {isOpen && inner}
    </div>
  );
};

export default ActionDropdown;

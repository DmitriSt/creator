import throttle from 'lodash.throttle';
import React, { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import uniqid from 'uniqid';

import { defaultColorPresets } from '../../../../models/constants/designer';
import copyIcon from '../../../assets/images/designer/copy.svg';
import styles from './colorPalette.module.scss';

type ColorPaletteEventType = (color: string) => void;

type ColorPalettePropsType = {
  initialColor?: string;
  presets?: string[];
  onBeforeChange?: ColorPaletteEventType;
  onChange?: ColorPaletteEventType;
  onAfterChange?: ColorPaletteEventType;
};

const throttledChange = throttle((color: string, onChange: ColorPaletteEventType) => {
  onChange(color);
}, 100);

const ColorPalette = ({
  initialColor = null,
  presets = defaultColorPresets,
  onBeforeChange,
  onChange,
  onAfterChange,
}: ColorPalettePropsType) => {
  const [color, setColor] = useState(initialColor ?? '#FFFFFF');

  const inputRef = useRef<HTMLInputElement>(null);
  const currentColor = useRef<string>(color);
  const isChanging = useRef(false);
  const isSaved = useRef(true);

  const beforeChanging = (color: string) => {
    if (onBeforeChange) onBeforeChange(color);
  };

  const changing = (color: string) => {
    isChanging.current = true;
    isSaved.current = false;
    if (onChange) onChange(color);
  };

  const afterChanging = (color: string) => {
    isChanging.current = false;
    if (onAfterChange && !isSaved.current) {
      onAfterChange(color);
      isSaved.current = true;
    }
  };

  useEffect(() => {
    return () => afterChanging(currentColor.current);
  }, []);

  useEffect(() => {
    if (!isChanging.current) beforeChanging(initialColor);
    if (color !== initialColor) {
      throttledChange(color, changing);
      currentColor.current = color;
    }
  }, [color]);

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999);
      document.execCommand('copy');
    }
  };

  const handleChange = (color: string) => {
    if (color.length <= 7) {
      setColor(color);
    }
  };

  const handlePresetChange = (color: string) => {
    setColor(color);
    afterChanging(color);
  };

  const handleInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.value[0] !== '#') target.value = `#${target.value}`;
    setColor(target.value);
  };

  const handleMouseUp = () => {
    afterChanging(currentColor.current);
    document.body.removeEventListener('mouseup', handleMouseUp, true);
  };

  const handleMouseDown = () => {
    document.body.addEventListener('mouseup', handleMouseUp, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    const MAX_LENGTH = 7;
    const upperCaseKey = e.key.toUpperCase();
    const target = e.target as HTMLInputElement;
    const symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    const special = ['BACKSPACE', 'DEL', 'DELETE', 'ARROWLEFT', 'ARROWRIGHT'];
    const allowedKeys = [...symbols, ...special];
    if ((symbols.includes(upperCaseKey) && target.value.length >= MAX_LENGTH) || !allowedKeys.includes(upperCaseKey)) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
      <div className={styles.controls}>
        <input
          className={styles.input}
          ref={inputRef}
          type='text'
          value={color}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='transparent'
        />
        <input
          className={styles.copy}
          type='button'
          style={{ backgroundImage: `url(${copyIcon})` }}
          onClick={handleCopy}
        />
      </div>
      <HexColorPicker className={styles.palette} color={color} onMouseDown={handleMouseDown} onChange={handleChange} />
      <div className={styles.presets}>
        {presets.map((preset) => (
          <div
            key={uniqid()}
            className={preset ? styles.preset : `${styles.preset} ${styles.transparent}`}
            onClick={() => handlePresetChange(preset)}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;

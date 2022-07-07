import React, { useEffect, useState } from 'react';

import { ReactComponent as Close } from '../../../assets/images/close_gray.svg';
import { ReactComponent as Zoom } from '../../../assets/images/productPage/zoom.svg';
import styles from './search.module.scss';

type SearchPropsType = {
  placeholder: string;
  className?: string;
  onChange?: (text: string) => void;
  onClose?: () => void;
  onSearch?: (text: string) => void;
  results?: number;
  classNameImg?: string;
  disabled?: boolean;
};

const Search = ({
  placeholder,
  className,
  onChange,
  onClose,
  onSearch,
  results,
  classNameImg,
  disabled = false,
}: SearchPropsType) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (onChange) onChange(text);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(text);
    }
  };

  const handeBlur = (value = '') => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearText = () => {
    setText('');
    handeBlur();
    if (onClose) {
      onClose();
    }
  };

  return (
    <section className={`${styles.wrapper} ${className} ${disabled && styles.disabled}`}>
      <div onClick={text ? clearText : null} className={text ? styles.image_wrapper : styles.zoom}>
        {text ? <Close className={`${classNameImg} svg-path-stroke`} /> : <Zoom className='svg-path-fill' />}
      </div>
      <input
        type='text'
        value={text}
        onChange={(e) => handleChange(e)}
        onKeyPress={(e) => handleKeyPress(e)}
        onBlur={() => handeBlur(text)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {!!results && text && <span className={styles.results}>{results}</span>}
    </section>
  );
};

export default Search;

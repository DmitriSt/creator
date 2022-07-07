import React, { ReactNode, useEffect, useState } from 'react';

import { ReactComponent as Warning } from '../../../assets/images/warning.svg';
import styles from './textField.module.scss';
import Tooltip from './Tooltip/Tooltip';

type TextFieldPropsType = {
  onBlur?: (value: string, id: string) => void;
  onFocus?: () => void;
  onInput?: (value: string, id: string) => void;
  inputMaskApplayer?: (value: string) => string;
  errorText?: string;
  children?: ReactNode;
  className?: string;
  defaultStyles?: string;
  disableFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  id?: string;
};

const TextField = ({
  onBlur,
  onFocus,
  children,
  errorText,
  className,
  defaultStyles,
  placeholder,
  initialValue = '',
  onInput,
  id = '',
  disableFocus = false,
  inputMaskApplayer,
}: TextFieldPropsType) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    if (state !== initialValue) {
      setState(initialValue);
    }
  }, [initialValue]);

  const upateState = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.currentTarget.value;
    if (inputMaskApplayer) {
      newVal = inputMaskApplayer(e.currentTarget.value);
    }
    if (onInput) {
      onInput(newVal, id);
    }
    setState(newVal);
  };
  const blurCallback = () => {
    if (onBlur) {
      onBlur(state, id);
    }
  };

  const defStyles = defaultStyles || '';
  return (
    <div className={`${styles.wrapper} ${className} ${errorText ? styles.error : defStyles}`}>
      <input
        tabIndex={disableFocus ? -1 : 0}
        className={styles.input}
        type='text'
        placeholder={placeholder || ''}
        value={state}
        onInput={upateState}
        onBlur={blurCallback}
        onFocus={onFocus}
      />
      {errorText && (
        <div className={styles.icon_wrapper}>
          <Tooltip className={styles.tooltip} text={errorText} />
          <Warning />
        </div>
      )}
      {children && !errorText && <div className={styles.icon_wrapper}>{children}</div>}
    </div>
  );
};

export default TextField;

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import uniqid from 'uniqid';

import { ReactComponent as Mark } from '../../../assets/images/checkMark.svg';
import styles from './checkbox.module.scss';

type CheckboxPropsType = {
  label?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  initialState?: boolean;
  children?: ReactNode;
};

type DependentCheckboxPropsType = {
  label?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  checked?: boolean;
  children?: ReactNode;
};

type RenderCheckboxPropsType = {
  label?: string;
  toggle?: () => void;
  checked: boolean;
  children?: ReactNode;
  checkboxStyle: string;
  checkboxId: string;
};

const layout = ({ label, toggle, checked, children, checkboxStyle, checkboxId }: RenderCheckboxPropsType) => (
  <label className={checkboxStyle} htmlFor={checkboxId}>
    <input id={checkboxId} type='checkbox' checked={checked} onChange={() => toggle()} />
    <div className={styles.checkbox}>{checked && <Mark className={`${styles.image} svg-path-stroke`} />}</div>
    {children || <span className={styles.label}>{label}</span>}
  </label>
);

const Checkbox = ({ label, onChange, disabled, initialState = false, children }: CheckboxPropsType) => {
  const [checked, setChecked] = useState(initialState);

  useEffect(() => {
    if (onChange) {
      onChange(checked);
    }
  }, [checked]);

  const toggle = () => {
    setChecked((checked) => !checked);
  };

  const checkboxId = uniqid();
  const checkboxStyle = useMemo(() => (disabled ? `${styles.wrapper} ${styles.disabled}` : styles.wrapper), [disabled]);

  return layout({
    label,
    toggle,
    checked,
    children,
    checkboxStyle,
    checkboxId,
  });
};

const DependentCheckbox = ({ label, onChange, disabled, checked, children }: DependentCheckboxPropsType) => {
  const toggle = () => {
    onChange(!checked);
  };

  const checkboxId = uniqid();
  const checkboxStyle = useMemo(() => (disabled ? `${styles.wrapper} ${styles.disabled}` : styles.wrapper), [disabled]);

  return layout({
    label,
    toggle,
    checked,
    children,
    checkboxStyle,
    checkboxId,
  });
};

export default Checkbox;
export { DependentCheckbox };

import React, { ReactNode } from 'react';

import styles from './radioButton.module.scss';

type RadioButtonPropsType = {
  checked: boolean;
  callback: (id: string) => void;
  children?: ReactNode;
  label?: string;
  id: string;
  name: string;
  className?: string;
};

const RadioButton = ({ checked, label, children, id, name, className, callback }: RadioButtonPropsType) => {
  const onChange = () => callback(id);
  return (
    <label className={`${styles.wrapper} ${className}`} htmlFor={id}>
      <input checked={checked} name={name} id={id} type='radio' value={id} onChange={onChange} />
      <div className={styles.outside_circle}>
        <div className={styles.inside_circle} />
      </div>
      <p className={styles.label}>{label}</p>
      {children}
    </label>
  );
};

export default RadioButton;

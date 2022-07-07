import React, { useEffect, useMemo, useState } from 'react';
import uniqid from 'uniqid';

import styles from './switch.module.scss';

type SwitchPropsType = {
  title?: string;
  checked?: boolean;
  disabled?: boolean;
  withStatus?: boolean;
  onEnable?: (state: boolean) => void;
  onDisable?: () => void;
  onChange?: (state: boolean) => void;
};

const Switch = ({
  title,
  checked = false,
  disabled = false,
  withStatus = true,
  onEnable,
  onDisable,
  onChange,
}: SwitchPropsType) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(checked);
  }, [checked]);

  useEffect(() => {
    if (onChange) {
      onChange(state);
    } else if (state && onEnable) {
      onEnable(state);
    } else if (!state && onDisable) {
      onDisable();
    }
  }, [state]);

  const toggle = () => {
    setState((checked) => !checked);
  };

  const switchId = uniqid();

  const switchStyle = useMemo(() => (disabled ? `${styles.switch} ${styles.disabled}` : styles.switch), [disabled]);

  const wrapperStyle = useMemo(() => ({ minWidth: withStatus ? 65 : 'unset' }), [withStatus]);

  return (
    <div className={switchStyle}>
      {title && <span className={styles.title}>{title}</span>}
      <label className={styles.wrapper} style={wrapperStyle} htmlFor={switchId}>
        <input id={switchId} type='checkbox' checked={state} onChange={toggle} />
        <div className={styles.slider} />
        {withStatus && <span className={styles.status}>{state ? 'ON' : 'OFF'}</span>}
      </label>
    </div>
  );
};

export default Switch;

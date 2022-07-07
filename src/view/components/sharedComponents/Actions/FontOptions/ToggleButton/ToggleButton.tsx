import React, { useEffect, useMemo, useState } from 'react';

import styles from './toggleButton.module.scss';

interface ToggleButtonPropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  enabled?: boolean;
  onToggle?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
}

const ToggleButton = ({ children, enabled = false, onEnable, onDisable, onToggle }: ToggleButtonPropsType) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked((checked) => !checked);
    if (!checked && onEnable) onEnable();
    if (checked && onDisable) onDisable();
    onToggle();
  };

  useEffect(() => {
    setChecked(enabled);
  }, [enabled]);

  const className = useMemo(() => (checked ? `${styles.button} ${styles.checked}` : styles.button), [checked]);

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

export default ToggleButton;

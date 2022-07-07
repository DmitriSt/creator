import React, { CSSProperties, ReactNode, useMemo } from 'react';

import styles from './actionButton.module.scss';

interface ActionButtonPropsType extends React.ButtonHTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconAlign?: 'left' | 'right';
}

const ActionButton = ({ icon, iconAlign = 'left', value, style, className, onClick }: ActionButtonPropsType) => {
  const buttonStyle: CSSProperties = useMemo(
    () => ({
      ...style,
      flexDirection: iconAlign === 'right' ? 'row-reverse' : 'row',
    }),
    [iconAlign, style]
  );

  const spanStyle: CSSProperties = useMemo(
    () => ({
      paddingRight: iconAlign === 'right' ? 7 : 0,
      paddingLeft: iconAlign === 'right' ? 0 : 7,
    }),
    [iconAlign, style]
  );

  return (
    <div className={`${styles.button} ${className || ''}`} style={buttonStyle} onClick={onClick}>
      {icon}
      {value && (
        <span className={styles.title} style={spanStyle}>
          {value}
        </span>
      )}
    </div>
  );
};

export default ActionButton;

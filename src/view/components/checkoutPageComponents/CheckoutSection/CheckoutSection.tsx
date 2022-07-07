import React, { ReactNode } from 'react';

import { ReactComponent as EditIcon } from '../../../assets/images/designer/brush.svg';
import Button from '../../sharedComponents/Button/Button';
import styles from './checkoutSection.module.scss';

type CheckoutSectionPropsType = {
  callback: () => void;
  openSection: () => void;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  step: string;
  isDirty?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
};

const CheckoutSection = ({
  callback,
  openSection,
  title,
  children,
  isOpen,
  step,
  isDirty = false,
  disabled = true,
  isLoading = false,
}: CheckoutSectionPropsType) => {
  const saveData = () => {
    if (disabled) return;
    callback();
  };

  return (
    <section className={styles.section}>
      <div className={`${styles.title} ${(isDirty || isOpen) && styles.title_colored}`}>
        <span className={styles.title_text}>{title}</span>
        {isDirty && !isOpen ? (
          <EditIcon onClick={openSection} className={styles.icon} />
        ) : (
          <span className={styles.step}>{step}</span>
        )}
      </div>
      {children}
      {isOpen && (
        <Button
          onClick={saveData}
          variant='outlined'
          className={`${styles.button} ${disabled ? styles.disabled : ''}`}
          value='Continue'
          isLoading={isLoading}
        />
      )}
    </section>
  );
};

export default CheckoutSection;

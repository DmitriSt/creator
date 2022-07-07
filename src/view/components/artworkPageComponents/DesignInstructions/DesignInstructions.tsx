import React from 'react';

import styles from './designInstructions.module.scss';

const DesignInstructions = () => {
  const printPage = () => {
    console.log('download');
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>DESIGN INSTRUCTIONS</p>
      <div className={styles.content}>
        <button type='button' onClick={() => printPage()} className={styles.button}>
          Download Templates (PDF)
        </button>
        <p className={styles.item}>— Make the document page size equal to the card size plus the bleed area</p>
        <p className={styles.item}>
          — If you aren&apos;t planning to include bleeds, the bleed area isn&apos;t necessary
        </p>
        <p className={styles.item}>— Use CMYK color profile</p>
      </div>
    </div>
  );
};

export default DesignInstructions;

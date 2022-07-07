import React, { useEffect, useState } from 'react';

import { Aligns, TextAligns } from '../../../../../../models/constants/designer';
import styles from './alignButton.module.scss';

type AlignButtonPropsType = {
  align?: TextAligns;
  onChange?: (prev: TextAligns, curr: TextAligns) => void;
};

const aligns: TextAligns[] = [Aligns.Left, Aligns.Center, Aligns.Right];

const AlignButton = ({ align = Aligns.Left, onChange }: AlignButtonPropsType) => {
  const [state, setState] = useState(aligns.indexOf(align));

  const handleClick = () => {
    setState((state) => ++state % aligns.length);
  };

  useEffect(() => {
    if (aligns[state] !== align) {
      onChange(align, aligns[state]);
    }
  }, [state]);

  return (
    <div className={`${styles.alignWrapper} ${styles[align]}`} onClick={handleClick}>
      <div className={styles.aligner} />
    </div>
  );
};

export default AlignButton;

import React, { useState } from 'react';

import styles from './themeLike.module.scss';

const ThemeLike = () => {
  const [blockColor, setBlockColor] = useState('unliked');

  const StyleHandler = () => {
    if (blockColor === 'unliked') {
      setBlockColor('liked');
    } else if (blockColor === 'liked') {
      setBlockColor('unliked');
    }
  };

  return (
    <div className={styles.container} onClick={StyleHandler}>
      <div className={styles.wrapper}>
        <svg
          width='21'
          height='18'
          id={`${styles[blockColor]}`}
          viewBox='0 0 21 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10.5 16.4297C8.54555 14.1579 6.61652 12.5947 5.03894 11.3163C4.64394 10.9962 4.27097 10.694 3.92515 10.4029C1.99961 8.78243 1 7.58785 1 5.56156C1 3.53371 2.3746 1.84209 4.16474 1.23538C5.88232 0.653256 8.04259 1.06383 9.67266 3.46478L10.5 4.68337L11.3273 3.46478C12.9574 1.06383 15.1177 0.653256 16.8353 1.23538C18.6254 1.84209 20 3.53371 20 5.56156C20 7.58785 19.0004 8.78243 17.0749 10.4029C16.729 10.694 16.3561 10.9962 15.9611 11.3163C14.3835 12.5947 12.4545 14.1579 10.5 16.4297Z'
            strokeWidth='2'
          />
        </svg>
      </div>
    </div>
  );
};

export default ThemeLike;

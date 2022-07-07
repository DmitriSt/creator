import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

import Loader from '../Loader/Loader';
import styles from './button.module.scss';

type ButtonStyle = {
  linkTo?: string;
  image?: string | JSX.Element;
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'inverted';
  isLoading?: boolean;
};

type ButtonPropsType = ButtonStyle & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  image,
  value = '',
  linkTo,
  variant = 'contained',
  color = 'primary',
  className = '',
  onClick,
  isLoading = false,
}: ButtonPropsType) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (linkTo || isLoading) return;
    onClick(e);
  };

  const button = (
    <button
      type='button'
      className={`${styles.button} ${styles[variant]} ${styles[color]} ${className}`}
      onClick={handleClick}
    >
      {!linkTo && isLoading ? (
        <Loader className={`${styles[`loader_${variant}`]} ${styles[`loader_${color}`]}`} isLocal isSmall />
      ) : (
        <>
          <span className={styles.value}>{value}</span>
          {image && (typeof image === 'string' ? <img className={styles.image} src={image} alt={`${value}`} /> : image)}
        </>
      )}
    </button>
  );

  return linkTo ? (
    <Link to={linkTo} style={{ textDecoration: 'none' }}>
      {button}
    </Link>
  ) : (
    <>{button}</>
  );
};

export default Button;

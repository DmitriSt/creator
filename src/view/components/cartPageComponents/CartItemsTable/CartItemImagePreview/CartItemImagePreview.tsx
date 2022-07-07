import React, { useEffect, useRef } from 'react';

import DesignSVGPreview from '../../../thanksPageComponents/OrderItems/OrderItem/DesignSVGPreview/DesignSVGPreview';
import styles from './сartItemImagePreview.module.scss';

type CartItemImagePreviewPropsType = {
  imageSrc: string;
  close: () => void;
};

const CartItemImagePreview = ({ imageSrc, close }: CartItemImagePreviewPropsType) => {
  const wrapperRef = useRef(null);
  const closeRef = useRef(null);

  const handleCloseOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === wrapperRef.current || e.target === closeRef.current) {
      close();
    }
  };

  const handleCloseEsc = (e: KeyboardEvent) => {
    if (e.code === 'Escape') close();
  };

  useEffect(() => {
    if (imageSrc) {
      document.addEventListener('keydown', handleCloseEsc, false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleCloseEsc, false);
      document.body.style.overflow = 'unset';
      if (imageSrc) close();
    };
  }, [imageSrc]);

  return (
    imageSrc && (
      <div ref={wrapperRef} className={styles.wrapper} onClick={handleCloseOnClick}>
        <div className={styles.popup}>
          <div ref={closeRef} className={styles.close} onClick={handleCloseOnClick} />
          <DesignSVGPreview designId={imageSrc} className={styles.image} />
        </div>
      </div>
    )
  );
};

export default CartItemImagePreview;

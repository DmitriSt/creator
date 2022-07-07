import React, { useState } from 'react';

import { ReactComponent as ZoomIcon } from '../../../../../../assets/images/productPage/zoom.svg';
// import SocialLinks from '../../../../../sharedComponents/SocialLinks/SocialLinks';
import styles from './zoom.module.scss';
import ZoomedSlider from './ZoomedSlider/ZoomedSlider';

type ZoomPropsType = {
  images: string[];
};

const Zoom = ({ images }: ZoomPropsType) => {
  const [number] = useState(images.length);
  const [showSlider, setShowSlider] = useState<boolean>(false);

  const handleOpen = () => {
    setShowSlider(true);
  };
  const handleClose = () => {
    setShowSlider(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.zoom_wrapper}>
        <div className={styles.zoom_block} onClick={handleOpen}>
          <ZoomIcon className='svg-path-fill' />
        </div>
        <div className={styles.size}>{number}</div>
      </div>
      {showSlider && <ZoomedSlider images={images} handleClose={handleClose} />}
      {
        // <div className={styles.social}>
        //   <SocialLinks />
        // </div>
      }
    </div>
  );
};

export default Zoom;

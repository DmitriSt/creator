import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { HeaderType } from '../../../../models/commonPage.models';
import logo from '../../../assets/images/ePrintCreator.svg';
import mcafee from '../../../assets/images/mcafee.png';
import norton from '../../../assets/images/norton.png';
import truste from '../../../assets/images/truste.png';
import styles from './checkoutHeader.module.scss';

type CheckoutHeaderType = {
  content: HeaderType;
};

const CheckoutHeader = ({ content }: CheckoutHeaderType) => {
  const { replace, push } = useHistory();
  const { pathname } = useLocation();

  const goToHome = () => {
    if (pathname.includes('thankyou')) {
      replace('/');
    } else push('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.prod_wrapper}>
        <div className={styles.logo_slogan_wrapper}>
          <div onClick={goToHome} className={styles.logo_wrapper}>
            <img src={logo} alt={content.brandingText} className={styles.logo} />
          </div>
          <p className={styles.slogan}>{content.message}</p>
        </div>
        <div className={styles.secure_elements_container}>
          <img src={norton} alt='norton' className={`${styles.secure_element} ${styles.norton}`} />
          <img src={mcafee} alt='mcafee' className={styles.secure_element} />
          <img src={truste} alt='truste' className={styles.secure_element} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;

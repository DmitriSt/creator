import React from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Check } from '../../../assets/images/checkThin.svg';
import OrderItems from '../OrderItems/OrderItems';
import OrderSummary from '../OrderSummary/OrderSummary';
import styles from './thanksPageContent.module.scss';

const ThanksPageContent = () => {
  const { replace } = useHistory();
  const printPage = () => {
    window.print();
  };
  const gotToHomepage = () => {
    replace('/');
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Thanks!</h1>
      <div className={styles.section}>
        <Check className={styles.image} />
        <p className={styles.text_bold}>Order Received</p>
      </div>
      <p>You’ve successfully placed the order.</p>
      <p>Confirmation email has been sent.</p>
      <div className={styles.content}>
        <OrderItems />
        <div className={styles.summary_wrapper}>
          <OrderSummary />
        </div>
        <div className={styles.links_block}>
          <span className={styles.link} onClick={gotToHomepage}>
            Continue Shopping
          </span>
          <div className={styles.pseudo_links}>
            <button type='button' onClick={() => printPage()} className={`${styles.button} ${styles.link}`}>
              Print
            </button>
            {
              // <button type='button' onClick={() => printPage()} className={`${styles.button} ${styles.link}`}>
              //   Download PDF
              // </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanksPageContent;

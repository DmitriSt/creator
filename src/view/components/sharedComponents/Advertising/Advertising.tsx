import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { CookiesNames } from '../../../../models/app.models';
import { AlertStatus, AlertType, defaultPageSettings, DisplayTypes } from '../../../../models/commonPage.models';
import close from '../../../assets/images/close.svg';
import styles from './advertising.module.scss';

type AdvertisingPropsType = {
  alert: AlertType;
};

const Advertising = ({ alert }: AdvertisingPropsType) => {
  const [active, setActive] = useState(true);

  const [cookies, setCookie] = useCookies(['name']);

  const handleClose = () => {
    setActive(false);
    setCookie(CookiesNames.AlertStatus, AlertStatus.Hidden);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout = null;
    setActive(cookies[CookiesNames.AlertStatus] !== AlertStatus.Hidden);
    if (alert.displayType === DisplayTypes.AutoClose) {
      const time = alert.displayDuration || defaultPageSettings.alert.DisplayTime;
      if (time > 0) {
        timer = setTimeout(handleClose, time * 1000);
      }
    }
    return () => (timer ? clearTimeout(timer) : null);
  }, []);

  return (
    <>
      {active && (
        <section className={styles.wrapper}>
          <div className={styles.advertisement}>
            <span className={styles.description}>{alert.text}</span>
            {alert.displayType !== DisplayTypes.Permanent && (
              <button type='button' className={styles.close} onClick={handleClose}>
                <img src={close} alt='Close' />
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
};
export default Advertising;

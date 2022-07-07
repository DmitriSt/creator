import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { FooterType, PageSetupType } from '../../../../models/commonPage.models';
import { getMenu } from '../../../../services/common.service';
import { checkSession } from '../../../../services/session.service';
import wallet from '../../../assets/images/wallet.svg';
import isHeaderInfo from '../../../stores/appStore/appSelectors';
import { updateMenu } from '../../../stores/commonStore/commonActions';
import { RootStateType } from '../../../stores/store';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import Menu from '../Menu/Menu';
import PageHeader from '../PageHeader/PageHeader';
import styles from './notFoundStub.module.scss';

const pageSetup: PageSetupType = {
  showSignIn: false,
  showAddToCart: true,
  showFooter: false,
  showHeader: false,
  title: '',
  description: '',
};

const footer: FooterType = {
  showCopyrightNotice: true,
  showPrivacyPolicy: false,
  showTermsOfUser: false,
  testimonials: [],
};

const NotFoundStub = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const header = useSelector(isHeaderInfo);
  const { menu: menuItems } = useSelector((state: RootStateType) => state.commonState);
  const { replace } = useHistory();
  const goToHome = () => {
    replace('/');
  };

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        await checkSession();
        const menu = await getMenu();
        dispatch(updateMenu(menu));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    if (!menuItems) {
      getData();
    }
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.wrapper}>
      {header && <PageHeader content={header} setup={pageSetup} />}
      {menuItems && <Menu items={menuItems} />}
      <div className={styles.content}>
        <img src={wallet} alt='wallet' className={styles.wallet} />
        <p className={styles.text}>Oops... We can’t find the page you are looking for...</p>
        <Button onClick={goToHome} value='Back to homepage' className={styles.button} />
      </div>
      <Footer footer={footer} />
    </div>
  );
};

export default NotFoundStub;

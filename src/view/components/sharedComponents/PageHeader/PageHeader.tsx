import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { HeaderType, PageSetupType } from '../../../../models/commonPage.models';
// import basket from '../../../assets/images/basket.svg';
import { ReactComponent as Cart } from '../../../assets/images/basket.svg';
import { RootStateType } from '../../../stores/store';
import LoginAvatar from '../../authorizationComponents/LoginAvatar';
import styles from './pageHeader.module.scss';

type PageHeaderType = {
  content: HeaderType;
  setup?: PageSetupType;
};

const PageHeader = ({ content, setup }: PageHeaderType) => {
  const counter = useSelector((state: RootStateType) => state.cartState.cart.lineItems?.length);

  return (
    <div className={styles.wrapper}>
      <div className={styles.prod_wrapper}>
        <div className={styles.logo_slogan_wrapper}>
          <Link to='/'>
            <img src={content.brandingLogo} alt={content.brandingText} className={styles.logo} />
          </Link>

          <p className={styles.slogan}>{content.message}</p>
        </div>

        {setup && (
          <div className={styles.signIn_basket_container}>
            {setup.showAddToCart && (
              <Link to='/cart'>
                <div className={styles.basket_wrapper}>
                  <Cart className='svg-path-stroke' />
                  <p className={styles.link_description}>Cart</p>
                  {!!counter && <div className={styles.basket_counter}>{counter}</div>}
                </div>
              </Link>
            )}
            {setup.showSignIn && <LoginAvatar />}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

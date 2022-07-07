import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import isHeaderInfo from '../../../stores/appStore/appSelectors';
import { RootStateType } from '../../../stores/store';
import Quote from '../../sharedComponents/Quote/Quote';
import styles from './footer.module.scss';

const Footer = () => {
  const testimonials = useSelector((state: RootStateType) => state.appState.testimonials);
  const { showCopyrightNotice, showTermsOfUser } = useSelector((state: RootStateType) => state.homePageState.footer);
  const header = useSelector(isHeaderInfo);
  const copyrightNotice = useSelector((state: RootStateType) => state.appState.config.copyrightNotice);

  return (
    <footer className={styles.wrapper}>
      <div className={styles.footer}>
        <div className={styles.logo_section}>
          <div className={styles.links_group}>
            {showTermsOfUser && <Link to='/'>Terms Of Use</Link>}
            {
              // showPrivacyPolicy && <Link to='/'>Privacy Policy</Link>
            }
          </div>
          {header && <img className={styles.logo} src={header.brandingLogo} alt='Branding Logo' />}
          {showCopyrightNotice && <span className={styles.copyright}>{copyrightNotice}</span>}
        </div>
        <div className={styles.recommended}>
          <span className={styles.title}>Recommended</span>
          <ul className={styles.list}>
            <li>
              <Link to='/'>UV Coated business card</Link>
            </li>
            <li>
              <Link to='/'>Lawn Signs</Link>
            </li>
            <li>
              <Link to='/'>CR80 Badge Holder With Horizontal Hole</Link>
            </li>
            <li>
              <Link to='/'>Lawn Sign (24in x 32in)</Link>
            </li>
            <li>
              <Link to='/'>Large TShirt</Link>
            </li>
            <li>
              <Link to='/'>Fluffy pillow</Link>
            </li>
          </ul>
        </div>
        {testimonials && <Quote statement={testimonials[0]} showMark />}
      </div>
    </footer>
  );
};

export default Footer;

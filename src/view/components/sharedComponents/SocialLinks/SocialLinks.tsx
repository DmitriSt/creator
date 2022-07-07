import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import facebook from '../../../assets/images/facebook.svg';
import instagramm from '../../../assets/images/instagramm.svg';
import twitter from '../../../assets/images/twitter.svg';
import { RootStateType } from '../../../stores/store';
import styles from './socialLinks.module.scss';

const SocialLinks: FC = () => {
  const links = useSelector((state: RootStateType) => state.commonState.socialLinks);

  return (
    links &&
    !!links.length && (
      <ul className={styles.social_container}>
        <li>
          <Link to='/'>
            <img src={instagramm} alt='instagramm' />
          </Link>
        </li>
        <li>
          <Link to='/'>
            <img src={twitter} alt='twitter' />
          </Link>
        </li>
        <li>
          <Link to='/'>
            <img src={facebook} alt='facebook' />
          </Link>
        </li>
      </ul>
    )
  );
};

export default SocialLinks;

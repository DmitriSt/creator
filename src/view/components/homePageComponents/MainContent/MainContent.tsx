import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { RootStateType } from '../../../stores/store';
import Button from '../../sharedComponents/Button/Button';
import styles from './mainContent.module.scss';

const MainContent: FC = () => {
  const state = useSelector((state: RootStateType) => state.homePageState.specials);

  const elements = state?.map((el) => (
    <div key={uniqid()} className={styles.content_wrapper}>
      <Link to={`/${el.product.action}`}>
        <div className={styles.image_block_wrapper}>
          <img className={styles.image} src={el.product.image.large} alt='new' />
        </div>
      </Link>
      <div className={styles.describe_block_wrapper}>
        <span className={styles.new_mark}>{el.badge}</span>
        <h2 className={styles.title}>{el.product.name}</h2>
        <p className={styles.subtitle}>{el.product.description}</p>
        <Button
          linkTo={`/${el.product.action}`}
          value={`${el.actionText}`}
          variant='outlined'
          color='secondary'
          className={styles.button}
        />
      </div>
    </div>
  ));
  return <div className={styles.wrapper}>{elements}</div>;
};

export default MainContent;

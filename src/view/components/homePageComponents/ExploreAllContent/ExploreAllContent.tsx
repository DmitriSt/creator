import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { ProductTypes } from '../../../../models/commonPage.models';
import { RootStateType } from '../../../stores/store';
import style from './exploreAllContent.module.scss';

const ExploreAllContent: FC = () => {
  const state = useSelector((state: RootStateType) => state.homePageState.products);

  return (
    <div className={style.wrapper}>
      <div className={style.products_wrapper}>
        <h3 className={style.title}>Explore All</h3>
        <div className={style.map_wrapper}>
          {state?.map((item) => (
            <div key={uniqid()} className={style.element_wrapper}>
              {item.action ? (
                <Link to={`/${item.productType === ProductTypes.Shelve ? `product/${item.productId}` : item.action}`}>
                  <img className={style.image_block} src={item.image.small} alt='product' />
                </Link>
              ) : (
                <img className={style.image_block} src={item.image.small} alt='product' />
              )}
              <h3 className={style.title_block}>{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreAllContent;

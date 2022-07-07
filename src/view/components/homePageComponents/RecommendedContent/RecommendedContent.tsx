import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { RootStateType } from '../../../stores/store';
import style from './recommendedContent.module.scss';

const RecommendedContent: FC = () => {
  const state = useSelector((state: RootStateType) => state.homePageState.recommended);

  return (
    <section className={style.wrapper}>
      <div className={style.recommended_wrapper}>
        <h3 className={style.title}>We also recommend</h3>
        <div className={style.map_wrapper}>
          {state?.map((item) => (
            <div key={uniqid()} className={style.element_wrapper}>
              {item.action ? (
                <Link to={`/${item.action}`}>
                  <img className={style.image_block} src={item.image.medium} alt={item.name} />
                </Link>
              ) : (
                <img className={style.image_block} src={item.image.medium} alt={item.name} />
              )}
              <h3 className={style.title_block}>{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedContent;

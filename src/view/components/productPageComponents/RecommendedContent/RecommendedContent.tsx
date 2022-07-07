import React from 'react';
import uniqid from 'uniqid';

import { ProductType } from '../../../../models/commonPage.models';
import { defaultProductPageSettings } from '../../../../models/productPage.models';
import Card from '../../sharedComponents/Card/Card';
import styles from './recommendedContent.module.scss';

type RecommendedContentpropsType = {
  text: string;
  recommended: ProductType[] | null;
};

const RecommendedContent = ({ text, recommended }: RecommendedContentpropsType) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.recommended}>
        <span className={`${styles.title} section_title`}>{text}</span>
        <div className={styles.grid}>
          {recommended?.slice(0, defaultProductPageSettings.recommended.count).map((product) => (
            <Card key={uniqid()} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default RecommendedContent;

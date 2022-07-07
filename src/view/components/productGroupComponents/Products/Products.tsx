import React from 'react';
import uniqid from 'uniqid';

import { ProductType } from '../../../../models/commonPage.models';
import Card from '../../sharedComponents/Card/Card';
import styles from './products.module.scss';

type ProductGroupPropsType = {
  products: ProductType[];
};

const Products = ({ products }: ProductGroupPropsType) => (
  <section className={styles.products}>
    {products.map((product) => (
      <Card key={uniqid()} product={product} />
    ))}
  </section>
);

export default Products;

import React from 'react';

import ProductPreview from './ProductPreview/ProductPreview';
import styles from './productSection.module.scss';
import ProductSidebar from './ProductSidebar/ProductSidebar';

const ProductSection = () => (
  <div className={styles.section}>
    <ProductPreview />
    <ProductSidebar />
  </div>
);

export default ProductSection;

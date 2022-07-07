import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// import { useHistory } from 'react-router';
// import { ActiveProductDTO } from '../../../../../models/artwork.models';
import { ProductTypes } from '../../../../../models/commonPage.models';
import { addProductItemToCart } from '../../../../../services/cart.service';
import cart from '../../../../assets/images/designer/whiteCart.svg';
import { updateStoreCart } from '../../../../stores/cartStore/cart/cartActions';
// import updateActiveProduct from '../../../../stores/artworkPageStore/activeProduct/activeProductActions';
import getPageConfig from '../../../../stores/productPageStore/productPageSelectors';
import { RootStateType } from '../../../../stores/store';
import Button from '../../../sharedComponents/Button/Button';
import Calculator from './Calculator/Calculator';
import styles from './productSidebar.module.scss';

// function syncFilters(apliedFilters: IBaseObj, initialFilters: IFilterConfig[] | null) {
//   if (!initialFilters) return null;
//   return (
//     initialFilters.map((item) => {
//       const mapValue = apliedFilters[item.text];
//       if (mapValue) {
//         return {
//           ...item,
//           items: [...item.items],
//           defaultValue: mapValue,
//         };
//       }
//       return item;
//     }) || null
//   );
// }

const ProductSidebar = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  // const { push } = useHistory();
  // const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [choosenfilters, setChoosenFilters] = useState<IBaseObj>({});
  const product = useSelector((state: RootStateType) => state.productPageState.details);
  const filters = useSelector((state: RootStateType) => state.productPageState.priceCalculatorConfig);
  const productId = useSelector((state: RootStateType) => state.productPageState.details?.productId);
  const pageSetup = useSelector(getPageConfig);
  const isCalculator =
    !!pageSetup &&
    pageSetup.showPriceCalculator &&
    filters &&
    !!filters.length &&
    filters.some((el) => el.items.length);
  const title = isCalculator ? 'Size & Finish' : 'Finish';
  const priceText = isCalculator ? 'Starting from' : 'Price';

  const addToCart = async () => {
    try {
      setIsLoading(true);
      const cart = await addProductItemToCart(product.productId);
      if (cart) {
        dispatch(updateStoreCart(cart));
        push('/cart');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // const goToArtworkPage = () => {
  //   if (productId) {
  //     const appliedFilters = syncFilters(choosenfilters, filters);
  //     const activeProduct: ActiveProductDTO = {
  //       filters: appliedFilters,
  //       id: productId,
  //       price: price > 0 ? price : null,
  //     };
  //     dispatch(updateActiveProduct(activeProduct));
  //     push(`/artwork/${productId}`);
  //   }
  // };

  // const updatePrice = useCallback((price: number) => setPrice(price), []);
  // const updateFilters = useCallback((filters: IBaseObj) => setChoosenFilters(filters), []);

  return (
    <section className={styles.sidebar}>
      <h2 className={styles.title}>{title}</h2>
      <Calculator
        productId={productId}
        priceText={priceText}
        isCalculator={isCalculator}
        filters={filters}
        // onPriceChange={updatePrice}
        // onFilterChange={updateFilters}
      />
      {
        // (product?.productType === ProductTypes.Uploadable ||
        //   product?.productType === ProductTypes.DesignableUploadable) && (
        //   <Button onClick={goToArtworkPage} value='Upload Ready Art' variant='outlined' className={styles.button} />
        // )
      }
      {(product?.productType === ProductTypes.Designable ||
        product?.productType === ProductTypes.DesignableUploadable) && (
        <Button linkTo={`/designer/create-design/${product?.productId}`} value='Customize' className={styles.button} />
      )}
      {product?.productType === ProductTypes.Shelve && (
        <Button onClick={addToCart} className={styles.button} image={cart} value='Add to Cart' isLoading={isLoading} />
      )}
    </section>
  );
};

export default ProductSidebar;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { CartItemDesignType, ICartItem } from '../../../../../models/cart.models';
import { IFilterConfigItem } from '../../../../../models/commonPage.models';
import { removeItem, updateCartItem } from '../../../../../services/cart.service';
import { ReactComponent as EditIcon } from '../../../../assets/images/designer/brush.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/images/designer/delete.svg';
import { ReactComponent as Zoom } from '../../../../assets/images/productPage/zoom.svg';
import { getPrecisionPrice, getRoundedPrice } from '../../../../helpers/cartHelpers';
import { updateStoreCart } from '../../../../stores/cartStore/cart/cartActions';
import { cartCurrencySign } from '../../../../stores/cartStore/cartSelectors';
import ActionButton from '../../../sharedComponents/Actions/ActionButton/ActionButton';
import Loader from '../../../sharedComponents/Loader/Loader';
import DesignSVGPreview from '../../../thanksPageComponents/OrderItems/OrderItem/DesignSVGPreview/DesignSVGPreview';
import styles from './cartItem.module.scss';
import CartItemOption from './CartItemOption/CartItemOption';

type CartItemPropsType = {
  className: string;
  product: ICartItem;
  togglePreview: (imageSrc: string) => void;
};

const CartItem = ({ className, product, togglePreview }: CartItemPropsType) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currency = useSelector(cartCurrencySign);

  const quantityOption = product.options.find((item) => item.text === 'Quantity');
  const otherOptions = product.options.filter((item) => item.text !== 'Quantity');
  const price = getPrecisionPrice(product.price / product.quantity, currency);
  const subTotal = getRoundedPrice(product.price, currency);

  const editProduct = () => push(`/designer/${product.designId}`);

  const deleteProduct = async () => {
    try {
      setIsLoading(true);
      const cart = await removeItem(product.itemId);
      // await new Promise((res) => setTimeout(() => res('asd'), 4000000));
      if (cart) {
        dispatch(updateStoreCart(cart));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const openPreview = () => togglePreview(product.designId);

  const changeOptionValue = async (selected: IFilterConfigItem, id: string) => {
    try {
      setLoadingOption(id);
      // await new Promise((res) => setTimeout(() => res('asd'), 4000000));
      const list = product.options.map((item) => {
        if (item.text === id) {
          return selected.value;
        }
        return item.selectedValue;
      });
      const newCart = await updateCartItem(product.itemId, list);
      if (newCart) {
        dispatch(updateStoreCart(newCart));
      }
      setLoadingOption(null);
    } catch (err) {
      setLoadingOption(null);
    }
  };

  return (
    <div className={`${styles.item} ${className}`}>
      <div className={styles.img_wrapper}>
        <DesignSVGPreview designId={product.designId} className={styles.product_image} />
        <div onClick={openPreview} className={styles.zoom_wrapper}>
          <Zoom className='svg-path-fill' />
        </div>
      </div>
      <div className={styles.info_wrapper}>
        <p className={styles.product_title}>{product.description}</p>
        {otherOptions &&
          !!otherOptions.length &&
          otherOptions.map((option) => (
            <CartItemOption
              key={option.text}
              className={styles.option}
              option={option}
              loadingOption={loadingOption}
              callback={changeOptionValue}
            />
          ))}
      </div>
      {quantityOption ? (
        <CartItemOption
          className={styles.dropdown}
          option={quantityOption}
          loadingOption={loadingOption}
          callback={changeOptionValue}
        />
      ) : (
        <span>{product.quantity}</span>
      )}
      <div>
        <p className={styles.price}>{price}</p>
        <p className={styles.price_hint}>per piece</p>
      </div>
      <p className={styles.subtotal}>{subTotal}</p>
      <div className={`${styles.controls} ${product.designer === CartItemDesignType.None && styles.reverse_controls}`}>
        {product.designer !== CartItemDesignType.None && (
          <ActionButton onClick={editProduct} icon={<EditIcon className={`${styles.edit_icon} svg-path-stroke`} />} />
        )}
        {isLoading ? (
          <Loader className={styles.small_loader} isSmall isLocal />
        ) : (
          <ActionButton
            className={styles.delete_icon}
            onClick={deleteProduct}
            icon={<DeleteIcon className='svg-path-fill' />}
          />
        )}
      </div>
    </div>
  );
};

const MemoizedCartItem = React.memo(CartItem);

export default MemoizedCartItem;

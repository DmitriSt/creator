import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getCancelController } from '../../../../../../httpClient';
import { IBaseObj, IFilterConfig, IFilterConfigItem } from '../../../../../../models/commonPage.models';
import { IProductPriceDTO } from '../../../../../../models/productPage.models';
import { getProductPrice } from '../../../../../../services/productPage.service';
import { getRoundedPrice } from '../../../../../helpers/cartHelpers';
import { RootStateType } from '../../../../../stores/store';
import Dropdown from '../../../../sharedComponents/Dropdown/Dropdown';
import Loader from '../../../../sharedComponents/Loader/Loader';
import styles from './calculator.module.scss';

type CalculatorPropsType = {
  filters: IFilterConfig[] | null;
  priceText: string;
  productId: number;
  isCalculator: boolean;
  onPriceChange?: (price: number) => void;
  onFilterChange?: (dto: IBaseObj) => void;
  initialPrice?: number;
};

const Calculator = ({
  filters,
  priceText,
  productId,
  isCalculator,
  onPriceChange,
  onFilterChange,
  initialPrice = 0,
}: CalculatorPropsType) => {
  const [price, setPrice] = useState(initialPrice);
  const [isPriceShouldBeRequested, setIsPriceShouldBeRequested] = useState(!initialPrice);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [choosenfilters, setChoosenFilters] = useState<IBaseObj>({});
  const currency = useSelector((state: RootStateType) => state.cartState.cart.currency);
  const total = getRoundedPrice(price, `${currency} `);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(choosenfilters);
    }
  }, [choosenfilters]);

  useEffect(() => {
    const controller = getCancelController();
    async function getPrice(id: number) {
      try {
        setLoading(true);
        const dto: IProductPriceDTO = {
          productId: id,
          attributes: Object.values(choosenfilters), // Array.from(choosenfilters.values()),
        };
        // await new Promise((resolve) => {
        //   setTimeout(() => resolve(''), 5000);
        // });
        const newPrice = await getProductPrice(dto, controller.token);
        setPrice(newPrice);
        if (onPriceChange) {
          onPriceChange(newPrice);
        }
        setLoading(false);
      } catch (err) {
        if (controller.token.reason) return;
        setIsError(true);
        setLoading(false);
      }
    }
    if (productId && isPriceShouldBeRequested) {
      getPrice(productId);
    }
    if (!isPriceShouldBeRequested) {
      setIsPriceShouldBeRequested(true);
    }
    return () => {
      setIsError(false);
      controller.cancel();
    };
  }, [choosenfilters, productId]);

  const updateFilters = (newFilterValue: IFilterConfigItem | null, id: string) => {
    if (newFilterValue && newFilterValue.value === choosenfilters[id]) return;
    if (!choosenfilters[id] && newFilterValue && newFilterValue.value === '') return;
    if (!choosenfilters[id] && !newFilterValue) return;
    const newMap = { ...choosenfilters };
    if (newFilterValue) {
      newMap[id] = newFilterValue ? newFilterValue.value : '';
      setChoosenFilters((prevState) => ({ ...prevState, ...newMap }));
    } else {
      delete newMap[id];
    }
    setChoosenFilters((prevState) => ({ ...prevState, ...newMap }));
  };

  // TODO change filters default value to object from start
  // waiting fo answer from customer are they can do it or not

  return (
    <section className={styles.calculator}>
      {isCalculator &&
        filters?.map(
          (config) =>
            config.items &&
            !!config.items.length && (
              <Dropdown
                key={config.description}
                className={styles.dropdown}
                initialValue={config.items.find((el) => el.value === config.defaultValue) || config.items[0]}
                description={config.description}
                items={config.items}
                onChange={(item: IFilterConfigItem | null) => updateFilters(item, config.text)}
              />
            )
        )}
      <div className={styles.price_section}>
        {priceText}
        {loading ? (
          <div className={styles.loader}>
            <Loader isLocal isSmall />
          </div>
        ) : (
          <span className={isError ? styles.error : styles.price}>{isError ? 'Error!' : total}</span>
        )}
      </div>
    </section>
  );
};

export default Calculator;

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PaymentType, Section, SectionPropsType, ShippingWay } from '../../../../models/checkout.models';
import { setBillingAddress } from '../../../../services/checkout.service';
import { validateAddress, validateCard } from '../../../helpers/checkoutHelpers';
import { updatePaymentStatus, updateSection } from '../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../stores/store';
import CheckoutSection from '../CheckoutSection/CheckoutSection';
import BillingAddress from './BillingAddress/BillingAddress';
import PaymentConfigPreview from './PaymentConfigPreview/PaymentConfigPreview';
import styles from './paymentSection.module.scss';
import PayWays from './PayWays/PayWays';

const PaymentSection = ({ isOpen }: SectionPropsType) => {
  const dispatch = useDispatch();
  const { shippingWay, shippingAddress } = useSelector((state: RootStateType) => state.checkoutState.user.shipping);
  const { provider, billingAddress, card } = useSelector((state: RootStateType) => state.checkoutState.user.payment);
  const { isReady: isShippingReady } = useSelector((state: RootStateType) => state.checkoutState.user.shipping);
  const isDeliveryReady = useSelector((state: RootStateType) => state.checkoutState.user.delivery.isReady);

  const [isDirty, setIsDirty] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isBillingForm, setIsBillingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    function validate() {
      const isCreditCard = !!provider && provider.type === PaymentType.DIRECT_PAY;
      const isCardValid = isCreditCard ? validateCard(card) : true;
      const isBillingAddressValid = isCreditCard && isBillingForm ? validateAddress(billingAddress) : true;
      return isCardValid && isBillingAddressValid;
    }
    if (isOpen) {
      timerId = setTimeout(() => {
        const isValid = validate();
        setDisabled(!isValid);
      }, 200);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isOpen, provider, billingAddress, card, isBillingForm]);

  const toggleForm = useCallback((val: boolean) => setIsBillingForm(val), []);

  const openSection = useCallback(() => dispatch(updateSection(Section.PAYMENT)), []);

  const saveData = async () => {
    try {
      setIsLoading(true);
      if (provider.type === PaymentType.DIRECT_PAY) {
        if (isBillingForm) {
          await setBillingAddress({
            ...billingAddress,
            companyName: '',
            apartmentNumber: '',
            phone2: '',
          });
        } else if (shippingWay === ShippingWay.SHIP_TO_ADDRESS) {
          await setBillingAddress({
            ...shippingAddress,
            companyName: '',
            apartmentNumber: '',
            phone2: '',
          });
        }
      }
      dispatch(updateSection(null));
      setIsDirty(true);
      dispatch(updatePaymentStatus(true));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <CheckoutSection
      disabled={disabled}
      openSection={openSection}
      isOpen={isOpen}
      isDirty={isDirty && isShippingReady && (shippingWay === ShippingWay.PICKUP ? true : isDeliveryReady)}
      step='3'
      title={Section.PAYMENT}
      callback={saveData}
      isLoading={isLoading}
    >
      {isOpen && (
        <div className={styles.content}>
          <PayWays />
          {provider && provider.type === PaymentType.DIRECT_PAY && (
            <BillingAddress initialValue={isBillingForm} callback={toggleForm} />
          )}
        </div>
      )}
      {!isOpen && isDirty && <PaymentConfigPreview isBillingForm={isBillingForm} />}
    </CheckoutSection>
  );
};

export default PaymentSection;

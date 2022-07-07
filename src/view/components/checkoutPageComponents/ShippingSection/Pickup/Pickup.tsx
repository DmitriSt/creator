import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import fakeMap from '../../../../assets/images/cart/fakeMap.png';
import { updatePickupAddress } from '../../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../../stores/store';
// import MapSearch from './MapSearch/MapSearch';
import styles from './pickup.module.scss';
import PickupItem from './PickupItem/PickupItem';

const Pickup = () => {
  const dispatch = useDispatch();
  const { pickupAddress } = useSelector((state: RootStateType) => state.checkoutState.user.shipping);
  const pickupLocations = useSelector((state: RootStateType) => state.checkoutState.checkout.pickupLocations);

  useEffect(() => {
    if (!pickupAddress) {
      dispatch(updatePickupAddress(pickupLocations[0]));
    }
  }, [pickupAddress]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {pickupLocations.map((item, index) => (
          <PickupItem
            key={item.locationId}
            pickupLocation={item}
            checked={pickupAddress ? pickupAddress.locationId === item.locationId : index === 0}
          />
        ))}
      </div>
      {
        // <div className={styles.map_wrapper}>
        //   <MapSearch />
        //   <img src={fakeMap} />
        // </div>
      }
    </div>
  );
};

export default Pickup;

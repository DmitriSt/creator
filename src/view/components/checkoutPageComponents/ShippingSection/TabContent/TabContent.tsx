import React from 'react';

import { ShippingWay } from '../../../../../models/checkout.models';
import Pickup from '../Pickup/Pickup';
import ShippingAddress from '../ShippingAddress/ShippingAddress';

type TabContentPropsType = {
  tab: ShippingWay;
};

const TabContent = ({ tab }: TabContentPropsType) => (tab === ShippingWay.PICKUP ? <Pickup /> : <ShippingAddress />);

export default TabContent;

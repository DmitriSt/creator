import React, { useEffect, useState } from 'react';
import uniqid from 'uniqid';

import { getCategoryElements } from '../../../../../../../business/services/CategoryService';
import Loader from '../../../../../sharedComponents/Loader/Loader';
import TabLists from '../TabLists/TabLists';

const TabCategory = ({ list, type, columns, productId, favourites }: any) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favourites) {
      setCategory([list]);
    } else {
      setLoading(true);
      if (list) {
        (async () => {
          const data = await getCategoryElements(list.imageSearch, productId, 0, list.imageCount);
          setCategory({
            name: list.name,
            elements: data,
          });
          setLoading(false);
        })();
      }
    }
  }, [list]);

  return (
    category && (
      <>
        {loading && <Loader />}

        <TabLists key={uniqid()} lists={category} index={0} type={type} columns={columns} favourites={favourites} />
      </>
    )
  );
};

export default TabCategory;

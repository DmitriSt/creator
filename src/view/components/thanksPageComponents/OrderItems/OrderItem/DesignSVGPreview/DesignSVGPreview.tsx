import React, { useEffect, useState } from 'react';

import { getDesignPreview, getImageUrl } from '../../../../../helpers/cartHelpers';

type DesignSVGPreviewPropsType = {
  className: string;
  designId: string;
};

const DesignSVGPreview = ({ className, designId }: DesignSVGPreviewPropsType) => {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    async function getSvg() {
      const svg = await getDesignPreview(getImageUrl(designId));
      setSvg(svg);
    }
    getSvg();
  }, []);
  // eslint-disable-next-line react/no-danger
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default DesignSVGPreview;

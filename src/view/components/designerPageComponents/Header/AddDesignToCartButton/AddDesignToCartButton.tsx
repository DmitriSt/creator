import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import designer from '../../../../../business/elements/Designer';
import createSVGFromDesigner from '../../../../../business/factories/designerToSVGFactory';
import { addDesignItemToCart } from '../../../../../services/cart.service';
import { updateCanvasSVG } from '../../../../../services/designer/designer.service';
import { ReactComponent as Cart } from '../../../../assets/images/designer/cart.svg';
import { updateStoreCart } from '../../../../stores/cartStore/cart/cartActions';
import { setShowPreview } from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import Button from '../../../sharedComponents/Button/Button';

type AddDesignToCartButtonPropsType = {
  className: string;
  isShowPreview: boolean;
  showPreview: () => void;
};

const AddDesignToCartButton = ({ className, isShowPreview, showPreview }: AddDesignToCartButtonPropsType) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const designId = useSelector((state: RootStateType) => state.designerState.designer.instance?.designId);

  // const downloadFile = (file: Blob, page: number, canvas: string | number) => {
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(file);
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', `page_${page}_canv_${canvas}.svg`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // const decodeHTML = (element: string, page: number, canvas: string | number) => {
  //   let newStr = element.replaceAll('&quot;', '"');
  //   newStr = newStr.replaceAll('&gt;', '>');
  //   newStr = newStr.replaceAll('&lt;', '<');
  //   const div = document.createElement('div');
  //   div.innerHTML = newStr;
  //   document.body.appendChild(div);
  //   const file = new Blob([newStr], { type: 'text/html' });
  //   downloadFile(file, page, canvas);
  // };

  const sendCanvasSVGs = async (designId: string) => {
    const svgPageList = await createSVGFromDesigner(designer);
    // svgPageList.forEach((page) => {
    //   const { svg, pageId, canvasId } = page;
    //   decodeHTML(svg, pageId, canvasId);
    // });
    const requestsList = svgPageList.reduce((total, item) => {
      const { svg, pageId, canvasId } = item;
      total.push(updateCanvasSVG(svg, designId, pageId, canvasId));
      item.canvasSVGList.forEach((el) => total.push(updateCanvasSVG(el.svg, designId, el.pageId, el.canvasId)));
      return total;
    }, [] as Promise<void>[]);
    await Promise.all(requestsList);
  };

  const addDesignItem = async () => {
    try {
      if (designId) {
        setIsloading(true);
        await sendCanvasSVGs(designId);
        const cart = await addDesignItemToCart(designId);
        dispatch(updateStoreCart(cart));
        setIsloading(false);
        push('/cart');
      }
    } catch (err) {
      setIsloading(false);
    }
  };

  const handleShowPreview = () => {
    showPreview();
  };

  return (
    <Button
      className={className}
      image={<Cart className='svg-path-stroke' />}
      variant='contained'
      color='secondary'
      value='Add to Cart'
      onClick={isShowPreview ? addDesignItem : handleShowPreview}
      isLoading={isLoading}
    />
  );
};

export default AddDesignToCartButton;

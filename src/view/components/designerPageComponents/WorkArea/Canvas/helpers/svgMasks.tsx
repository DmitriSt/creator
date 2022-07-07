import React from 'react';

import BaseElement from '../../../../../../business/elements/BaseElement';
import { IWithImage } from '../../../../../../business/interfaces/featuresInterfaces';
import { IDimension, IPosition } from '../../../../../../business/interfaces/interfaces';
import { getAlphaColorFilter } from './svgFilters';
import { SvgDefsType } from './types';

export function getImageMask(
  element: BaseElement,
  position: IPosition,
  dimensions: IDimension
): SvgDefsType<React.SVGProps<SVGMaskElement>> {
  if (!element) return null;
  const id = `image-mask-${element.id}`;
  const render = (
    <mask id={id}>
      <rect x={position.x} y={position.y} width={element?.width} height={element?.height} fill='#FFFFFF' />
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill='#FFFFFF77' />
    </mask>
  );
  return { id, render };
}

export function getStickerMask(
  element: BaseElement & IWithImage,
  position: IPosition,
  dimensions: IDimension
): SvgDefsType<React.SVGProps<SVGMaskElement>> {
  if (!element) return null;
  const id = `sticker-mask-${element.id}`;
  const imageMask = getImageMask(element, position, dimensions);
  const alphaColorFilter = getAlphaColorFilter(element);
  const render = (
    <mask id={id}>
      {alphaColorFilter?.render}
      <image
        preserveAspectRatio='none'
        width={dimensions.width}
        height={dimensions.height}
        href={element?.source}
        style={{ WebkitFilter: `url("#${alphaColorFilter?.id}")`, filter: `url("#${alphaColorFilter?.id}")` }}
        mask={`url(#${imageMask.id})`}
      />
    </mask>
  );
  return { id, render };
}

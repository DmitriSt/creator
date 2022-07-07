import React from 'react';

import BaseElement from '../../../../../../business/elements/BaseElement';
import { IWithFilters } from '../../../../../../business/interfaces/featuresInterfaces';
import { SvgDefsType } from './types';

export function getSvgFilters(element: BaseElement & IWithFilters): SvgDefsType<React.SVGProps<SVGFilterElement>> {
  if (!element?.filters) return null;
  const id = `filters-${element.id}`;
  const initialMatrixId = `matrix-initial-${element.id}`;
  const floodId = `flood-${element.id}`;
  const render = (
    <filter id={id}>
      {element.filters.isGrayscale && (
        <feColorMatrix
          type='matrix'
          values='0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
        />
      )}
      {element.filters.isInverted && (
        <feColorMatrix type='matrix' values='-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0' />
      )}
      <feComponentTransfer>
        <feFuncR type='linear' slope={element.filters.brightness} />
        <feFuncG type='linear' slope={element.filters.brightness} />
        <feFuncB type='linear' slope={element.filters.brightness} />
      </feComponentTransfer>
      <feComponentTransfer>
        <feFuncR type='linear' slope={element.filters.contrast} intercept={-(0.5 * element.filters.contrast) + 0.5} />
        <feFuncG type='linear' slope={element.filters.contrast} intercept={-(0.5 * element.filters.contrast) + 0.5} />
        <feFuncB type='linear' slope={element.filters.contrast} intercept={-(0.5 * element.filters.contrast) + 0.5} />
      </feComponentTransfer>
      <feGaussianBlur stdDeviation={element.filters.blur} />
      {element.filters.colorization && !element.filters.isGrayscale && (
        <>
          <feColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0' result={initialMatrixId} />
          <feFlood floodColor={element.filters.colorization} result={floodId} />
          <feBlend mode='luminosity' in={initialMatrixId} in2={floodId} />
        </>
      )}
    </filter>
  );
  return { id, render };
}

export function getAlphaColorFilter(element: BaseElement): SvgDefsType<React.SVGProps<SVGFilterElement>> {
  if (!element) return null;
  const id = `alpha-color-${element.id}`;
  const whiteRGBAMatrix = '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0';
  const render = (
    <filter id={id}>
      <feColorMatrix in='SourceGraphic' type='matrix' values={whiteRGBAMatrix} />
    </filter>
  );
  return { id, render };
}

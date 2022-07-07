import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { IPosition } from '../../../../business/interfaces/interfaces';
import { ReactComponent as IconPlus } from '../../../assets/images/plus.svg';
import { getElementBounds } from '../../../helpers/designer';
import { between } from '../../../helpers/utils';
import { RootStateType } from '../../../stores/store';
import ColorPalette from '../ColorPalette/ColorPalette';
import Mover from '../Mover/Mover';
import styles from './colorizer.module.scss';

type ColorizerPropsType = {
  side?: 'left' | 'bottom' | 'right';
  show?: boolean;
  initialColor?: string;
  className?: string;
  presets?: string[];
  onClose?: () => void;
  onBeforeChange?: (color: string, prevColor: string) => void;
  onChange?: (color: string, prevColor: string) => void;
  onAfterChange?: (color: string, prevColor: string) => void;
};

const Colorizer = ({
  side = 'right',
  show = false,
  initialColor = '#FFFFFF',
  className,
  presets,
  onClose,
  onBeforeChange,
  onChange,
  onAfterChange,
}: ColorizerPropsType) => {
  const [isBubble, setBubble] = useState(show);
  const [color, setColor] = useState(initialColor);
  const [move, setMove] = useState({ x: 0, y: 0 });
  const isShowToolbar = useSelector((state: RootStateType) => state.designerState.toolbar.toolbarShow);

  const invokerRef = useRef<HTMLDivElement>(null);
  const prevColor = useRef<string>(initialColor);

  const paletteParent = useRef<HTMLDivElement>(null);
  const prevToolbarState = useRef(false);

  useEffect(() => {
    if (prevToolbarState.current !== isShowToolbar && !isShowToolbar) {
      setMove({ x: 0, y: 0 });
    }
    return () => {
      prevToolbarState.current = isShowToolbar;
    };
  }, [isShowToolbar]);

  useEffect(() => {
    if (show) setBubble(show);
  }, [show]);

  const hideBubble = () => {
    setBubble(false);
    if (onClose) onClose();
  };

  const toggleBubble = () => {
    setBubble((bubble) => !bubble);
  };

  const onMove = useCallback((movement: IPosition) => setMove(movement), []);

  const isColorPaletteOutOfWorkArea = useCallback(
    (movementDiff: IPosition) => {
      const workAreaBounds = getElementBounds('work-area');
      const elBounds = paletteParent.current && paletteParent.current.getBoundingClientRect();
      if (workAreaBounds && elBounds) {
        const workAreaLeft = side === 'right' ? workAreaBounds.left - 2 : workAreaBounds.left;
        const workAreaTop = side === 'right' ? workAreaBounds.top - 16 : workAreaBounds.top;
        return (
          workAreaLeft > elBounds.left + movementDiff.x ||
          workAreaTop > elBounds.top + movementDiff.y ||
          workAreaBounds.right < elBounds.right + movementDiff.x ||
          workAreaBounds.bottom < elBounds.bottom + movementDiff.y
        );
      }
      throw Error('Can`t get bounds');
    },
    [paletteParent.current, side]
  );

  const position = useMemo<IPosition>(() => {
    const PADDING = 15;
    if (!invokerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }
    const invokerBounds = invokerRef.current.getBoundingClientRect();
    console.log(invokerBounds);
    if (side === 'left') {
      return {
        x: between(invokerBounds.left - PADDING, 0, Infinity),
        y: between(invokerBounds.top + PADDING, 0, Infinity),
      };
    }
    if (side === 'bottom') {
      return {
        x: between(invokerBounds.left + invokerBounds.width / 2, 0, Infinity),
        y: between(invokerBounds.top + invokerBounds.height + PADDING, 0, Infinity),
      };
    }
    return {
      x: between(invokerBounds.left + invokerBounds.width + PADDING, 0, Infinity),
      y: between(invokerBounds.top + invokerBounds.height / 2, 0, Infinity),
    };
  }, [invokerRef.current]);

  const transform = useMemo<string>(() => {
    switch (side) {
      case 'left':
        return 'translate(-100%, -50%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      default:
        return 'translate(0, -50%)';
    }
  }, [side]);

  const style = useMemo<React.CSSProperties>(() => {
    return move.x && move.y
      ? {
          left: move.x,
          top: move.y,
        }
      : {
          left: position.x,
          top: position.y,
          transform,
        };
  }, [position, transform, move]);

  const bubbleStyle = useMemo<string>(() => {
    switch (side) {
      case 'left':
        return `${styles.bubble} ${styles.right}`;
      case 'bottom':
        return `${styles.bubble} ${styles.top}`;
      default:
        return styles.bubble;
    }
  }, [side]);

  const handleColorBeforeChange = (color: string) => {
    prevColor.current = color;
    if (onBeforeChange) onBeforeChange(color, prevColor.current);
  };

  const handleColorChange = (color: string) => {
    setColor(color);
    if (onChange) onChange(color, prevColor.current);
  };

  const handleColorAfterChange = (color: string) => {
    if (prevColor.current === color) return;
    if (onAfterChange) onAfterChange(color, prevColor.current);
    prevColor.current = color;
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.colorizer}>
      <div
        ref={invokerRef}
        className={`${styles.color} ${className}`}
        onClick={toggleBubble}
        style={{ backgroundColor: color }}
      >
        <IconPlus className='svg-path-stroke' />
      </div>
      {isBubble && (
        <div className={styles.bubble_wrapper} onMouseDown={hideBubble}>
          <div ref={paletteParent} className={bubbleStyle} style={style} onMouseDown={stopPropagation}>
            <ColorPalette
              initialColor={color}
              presets={presets}
              onBeforeChange={handleColorBeforeChange}
              onChange={handleColorChange}
              onAfterChange={handleColorAfterChange}
            />
            <Mover
              isResetPosition={prevToolbarState.current !== isShowToolbar && !isShowToolbar}
              validationFunction={isColorPaletteOutOfWorkArea}
              onClose={hideBubble}
              onMove={onMove}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Colorizer;

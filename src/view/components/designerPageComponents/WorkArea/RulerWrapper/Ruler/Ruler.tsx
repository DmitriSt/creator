import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Axes } from '../../../../../../models/constants/designer';
import { RootStateType } from '../../../../../stores/store';
import styles from './ruler.module.scss';
import RulerUnit from './RuletUnit/RulerUnit';

type PulerPropsType = {
  orientation?: Axes;
  indent: number;
};

const ppi = 300;

const Ruler = ({ orientation = Axes.Horizontal, indent }: PulerPropsType) => {
  const canvas = useSelector((state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas());
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  if (!canvas) return null;

  const inchList = useMemo(() => {
    const size = orientation === Axes.Horizontal ? canvas.width : canvas.height;
    return Array.from(Array(Math.ceil(size / ppi) + 1).keys());
  }, [canvas.width, canvas.height]);

  const style = () => {
    return orientation === Axes.Horizontal ? { left: indent } : { top: indent };
  };

  return (
    <div
      className={`${styles.wrapper} ${
        orientation === Axes.Horizontal ? styles.wrapper_horizontal : styles.wrapper_vertical
      }`}
    >
      <div
        className={`${styles.list} ${orientation === Axes.Horizontal ? styles.list_horizontal : styles.list_vertical}`}
        style={style()}
      >
        {inchList.map((el) => (
          <RulerUnit key={el} value={el} size={ppi * coefficient * zoom} isVertical={orientation === Axes.Vertical} />
        ))}
      </div>
    </div>
  );
};

const memoizedRuler = React.memo(Ruler);

export default memoizedRuler;

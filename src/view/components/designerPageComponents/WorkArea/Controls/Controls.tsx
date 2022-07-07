import React, { useCallback, useState } from 'react';

import BottomControls from '../BottomControls/BottomControls';
import RulerWrapper from '../RulerWrapper/RulerWrapper';

const Controls = () => {
  const [isRulers, setIsRulers] = useState(false);

  const toggleRulers = useCallback((value: boolean) => setIsRulers(value), []);

  return (
    <>
      {isRulers && <RulerWrapper />}
      <BottomControls toggleRulers={toggleRulers} />
    </>
  );
};

export default Controls;

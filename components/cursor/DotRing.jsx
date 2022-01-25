import React, { useContext } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import { MouseContext } from '../../context/MouseContext';

const DotRing = () => {
  const { cursorType } = useContext(MouseContext);
  const { x, y } = useMousePosition();
  return (
    <>
      {/* ring */}
      <div style={{ left: `${x}px`, top: `${y}px` }} className={"ring " + cursorType}> </div>
      {/* dot */}
      <div className={"dot " + cursorType} style={{ left: `${x}px`, top: `${y}px` }}></div>
    </>
  );
};

export default DotRing;

import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';


export default function Switch() {
  const { dark, toggle } = useContext(ThemeContext);
  return (
    <button className="switch" onClick={() => toggle()}>
      {!dark ? <i className="far fa-moon" /> : <i className="far fa-sun" />}
    </button>
  );
} 
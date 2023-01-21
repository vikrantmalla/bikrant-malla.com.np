import React, { useState } from "react";

export const MouseContext = React.createContext({
  cursorType: "",
  cursorChangeHandler: () => { },
});

const MouseContextProvider = (props) => {
  const [cursorType, setCursorType] = useState("");

  const cursorChangeHandler = (cursorType) => {
    setCursorType(cursorType);
  };
  const mouseContext = {
    cursorType: cursorType, cursorChangeHandler: cursorChangeHandler
  }
  return (
    <MouseContext.Provider value={mouseContext}>
      {props.children}
    </MouseContext.Provider>
  );
};

export default MouseContextProvider;

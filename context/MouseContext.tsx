import React, { createContext, useContext, useState } from "react";
import Data, { Contexts } from "../types/data";

const appContextDefaultValues: Contexts.MouseContext = {
  cursorType: "",
  cursorChangeHandler: () => {},
};

const MouseContext = createContext<Contexts.MouseContext>(
  appContextDefaultValues
);

export function useMouseCursor(): Contexts.MouseContext {
  return useContext(MouseContext);
}

const MouseContextProvider = ({ children }: Data.Props) => {
  const [cursorType, setCursorType] = useState<string>("");

  const cursorChangeHandler = (cursorType: React.SetStateAction<string>) => {
    setCursorType(cursorType);
  };

  const mouseContext = {
    cursorType: cursorType,
    cursorChangeHandler: cursorChangeHandler,
  };
  return (
    <MouseContext.Provider value={mouseContext}>
      {children}
    </MouseContext.Provider>
  );
};

export default MouseContextProvider;

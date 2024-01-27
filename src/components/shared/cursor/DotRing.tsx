"use client";
import React from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import useMousePosition from "../../../app/hooks/useMousePosition";

const DotRing = () => {
  const cursorType = useSelector(
    (state: RootState) => state.mouseEffect.cursorType
  );
  const { x, y } = useMousePosition();
  return (
    <>
      {/* ring */}
      <div
        style={{ left: `${x}px`, top: `${y}px` }}
        className={"ring " + cursorType}
      >
        {" "}
      </div>
      {/* dot */}
      <div
        className={"dot " + cursorType}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
    </>
  );
};

export default DotRing;

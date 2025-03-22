"use client";
import React from "react";
import useMousePosition from "../../../app/hooks/useMousePosition";
import { joseFont } from "@/helpers/lib/font";
import { useMouseStore } from "@/store/feature/mouseStore";

const DotRing = () => {
  const { cursorType } = useMouseStore();

  const { x, y } = useMousePosition();
  return (
    <>
      {/* ring */}
      <div
        style={{ left: `${x}px`, top: `${y}px` }}
        className={`${joseFont} fs-400 ring  + ${cursorType}`}
      >
        {" "}
      </div>
      {/* dot */}
      <div
        className={`${joseFont} fs-400 dot  + ${cursorType}`}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
    </>
  );
};

export default DotRing;

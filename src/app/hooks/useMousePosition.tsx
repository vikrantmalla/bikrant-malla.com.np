import { setMousePosition } from "@/redux/feature/mouseSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useMousePosition() {
  const mousePosition = useSelector(
    (state: RootState) => state.mouseEffect.mousePosition
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const mouseMoveHandler = (event: any) => {
      const { clientX, clientY } = event;
      dispatch(setMousePosition({ x: clientX, y: clientY }));
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [dispatch]);

  return mousePosition;
}

import { useMouseStore } from "@/store/feature/mouseStore";
import { useEffect } from "react";

export default function useMousePosition() {
  const { mousePosition, setMousePosition } = useMouseStore();

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };

    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [setMousePosition]);

  return mousePosition;
}

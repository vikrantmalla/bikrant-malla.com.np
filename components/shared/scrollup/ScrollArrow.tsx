import { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollArrow() {
  // The back-to-top button is hidden at the beginning
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  // This function will scroll the window to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      {showButton && (
        <div className="back-to-top">
          <FaChevronUp onClick={scrollToTop}  className="topArrow"/>
        </div>
      )}
    </div>
  );
}

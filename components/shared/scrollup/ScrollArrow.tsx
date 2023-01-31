import { useState, useEffect } from "react";

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
        <i className="fas fa-chevron-up back-to-top" onClick={scrollToTop} />
      )}
    </div>
  );
}

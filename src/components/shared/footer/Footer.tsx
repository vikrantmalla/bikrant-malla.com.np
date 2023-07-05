"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname()
  return (
    <>
      <footer
        className={`${pathname === "/404" ? "notfoundFooter" : ""}`}
      >
        <div className="credit">
          <Link
            href="https://github.com/vikrantmalla/bikrant-malla.com.np.git"
            className="ff-serif-jose fs-300"
            passHref
          >
            {`Design & Built by Bikrant Malla`}
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

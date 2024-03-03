"use client";
import { joseFont } from "@/helpers/lib/font";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return (
    <>
      <footer className={`${pathname === "/404" ? "notfoundFooter" : ""}`}>
        <div className="credit">
          <Link
            href="https://github.com/vikrantmalla/bikrant-malla.com.np.git"
            className={`${joseFont} fs-300`}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub (opens in a new tab)"
          >
            {`Design & Built by Bikrant Malla`}
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

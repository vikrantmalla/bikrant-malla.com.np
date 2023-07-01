import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  return (
    <>
      <footer
        className={`${router.pathname === "/404" ? "notfoundFooter" : ""}`}
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

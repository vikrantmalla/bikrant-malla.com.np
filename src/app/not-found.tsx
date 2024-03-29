import Link from "next/link";
import { joseFont, tekoFont } from "@/helpers/lib/font";

export async function generateMetadata() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const appTitle = "404: This page could not be found";
  return {
    metadataBase: new URL(`${appUrl}`),
    title: appTitle,
    openGraph: {
      title: appTitle,
    },
    twitter: {
      title: appTitle,
    },
    robots: {},
    alternates: {
      canonical: "",
    },
  };
}

export default function NotFound() {
  return (
    <>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1 className={`${tekoFont}`}>404</h1>
          </div>
          <h2 className={`${joseFont} fs-600`}>{`OOPs!!`} Page not found!</h2>
          <p className={`${joseFont} fs-400`}>
            The page you are looking for might have been removed or temporarily
            unavailable. {`I'm`} guessing you spelled something wrong. Can you
            double check that URL?
          </p>
          <Link href="/" className={`${joseFont} fs-400`} aria-label="Back to Home">
            Back To Home
          </Link>
        </div>
      </div>
    </>
  );
}

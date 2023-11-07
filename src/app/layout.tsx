import ThemeProvider from "@/context/ThemeContext";
import Provider from "@/utils/provider";
import NavBar from "@/components/shared/header/NavBar";
import Footer from "@/components/shared/footer/Footer";
import "../styles/globals.scss";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body>
          <Provider>
            <NavBar />
            {children}
            <Footer />
          </Provider>
        </body>
      </ThemeProvider>
    </html>
  );
}

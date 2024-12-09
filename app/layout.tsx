import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bringam",
  description: "Soft Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <ReduxProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            closeOnClick
            pauseOnHover={false}
            draggable
            hideProgressBar
            className="text-black text-center font-medium !font-montserrat"
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

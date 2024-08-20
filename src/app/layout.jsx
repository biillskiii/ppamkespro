import { Manrope } from "next/font/google";
import "./globals.css";
import MobileOnlyMessage from "@/components/mobile";
const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "PPAM Kespro",
  description: "PPAM Assessment By Kespro FK Unnes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <MobileOnlyMessage />
        {children}
      </body>
    </html>
  );
}

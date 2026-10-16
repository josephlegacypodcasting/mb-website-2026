import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Market Better | One System. Marketing + Sales.",
  description:
    "Market Better fuses marketing and sales into one system: a video-first content engine built around your ICP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

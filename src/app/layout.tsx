import type { Metadata } from "next";
import { Inter, Poppins, Rubik, Ubuntu } from "next/font/google";
import "./globals.css";
import AppProviders from "@/lib/app-providers";

const rubik = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "File Creation",
  description: " app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

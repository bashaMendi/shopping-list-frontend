import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import StoreProvider from "../features/shoppingLists/StoreProvider";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopping List App",
  description: "Full-Stack Shopping List Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

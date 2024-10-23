import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import DefaultLayout from "@/components/default/layouts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense",
  // description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
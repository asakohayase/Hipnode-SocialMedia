import React from "react";

import NextAuthProvider from "./NextAuthProvider";
import { getServerSession } from "next-auth";

import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const SourceSansPro = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hipnode",
  description: "Modern Social Media Forum Web App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={SourceSansPro.className}>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </body>
    </html>
  );
}

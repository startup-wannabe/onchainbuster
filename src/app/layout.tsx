import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";

import "@radix-ui/themes/styles.css";
import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const OnchainProviders = dynamic(
  () => import("src/components/OnchainProviders"),
  {
    ssr: false,
  }
);

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "How Based Are You?",
  description: "Learn about your Base onchain data.",
  openGraph: {
    title: "How Based Are You?",
    description: "Learn about your Base onchain data.",
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center">
        <Theme>
          <OnchainProviders>
            <React.Fragment>
              {children}
              <ToastContainer />
            </React.Fragment>
          </OnchainProviders>
        </Theme>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

import '@radix-ui/themes/styles.css';
import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Theme } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import type React from 'react';
import { MagicProvider } from './contexts/MagicContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const coinbaseDisplay = localFont({
  src: [
    {
      path: '../../fonts/CoinbaseDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/CoinbaseDisplay-Medium.woff2',
      weight: '500 800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-coinbase-display',
});

const coinbaseSans = localFont({
  src: [
    {
      path: '../../fonts/CoinbaseSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/CoinbaseSans-Medium.woff2',
      weight: '500 800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-coinbase-sans',
});

const coinbaseMono = localFont({
  src: [
    {
      path: '../../fonts/CoinbaseMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/CoinbaseMono-Medium.woff2',
      weight: '500 800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-coinbase-mono',
});

const britney = localFont({
  src: [
    {
      path: '../../fonts/BritneyVariableVF.woff2',
    },
  ],
  display: 'swap',
  variable: '--font-britney',
});

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'How Based Are You?',
  description: 'Learn about your Base onchain data.',
  openGraph: {
    title: 'How Based Are You?',
    description: 'Learn about your Base onchain data.',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontClassNames = [
    coinbaseDisplay.variable,
    coinbaseSans.variable,
    coinbaseMono.variable,
    britney.variable,
  ].join(' ');
  return (
    <html lang="en" className={`${fontClassNames} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex font-sans items-center justify-center">
        <Theme>
          <OnchainProviders>
            <TooltipProvider>
              <MagicProvider>
                <div
                  style={{
                    minHeight: '100vh',
                    paddingBottom: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {children}
                  <Footer />
                </div>
                <ToastContainer />
              </MagicProvider>
            </TooltipProvider>
          </OnchainProviders>
        </Theme>
      </body>
    </html>
  );
}

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
import { Unbounded } from 'next/font/google';
import type React from 'react';
import { MagicProvider } from './contexts/MagicContext';

const unboundedFont = Unbounded({
  subsets: ['latin'],
  display: 'auto',
  variable: '--font-coinbase-sans',
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
  return (
    <html lang="en" className={`${unboundedFont.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex font-sans items-center justify-center">
        <Theme>
          <OnchainProviders>
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
          </OnchainProviders>
        </Theme>
      </body>
    </html>
  );
}

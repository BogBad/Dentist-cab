import type { Metadata } from 'next';
import './globals.css';
import Providers from '../lib/providers';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: {
    template: '%s | DentistCab',
    default: 'Головна',
  },
  icons: [
    {
      rel: 'icon',
      url: '/icons/favicon.ico',
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} overflow-y-hidden antialiased`}
      >
        <NextTopLoader showSpinner={false} />
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}

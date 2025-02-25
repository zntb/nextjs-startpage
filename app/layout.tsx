import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CheckboxProvider } from '@/hooks/CheckboxContext';
import { Toaster } from 'react-hot-toast';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StartPage',
  description: 'NextJS StartPage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <CheckboxProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster
            position='bottom-right'
            toastOptions={{
              duration: 3000,
              style: { background: '#e0e0e0', color: '#161616' },
            }}
          />

          {children}
        </body>
      </CheckboxProvider>
    </html>
  );
}

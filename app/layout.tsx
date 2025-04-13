import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CheckboxProvider } from '@/hooks/CheckboxContext';
import { AuthModalProvider } from '@/hooks/AuthModalProvider';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

import './globals.css';
import { auth } from '@/auth';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='en' suppressHydrationWarning>
      <CheckboxProvider>
        <SessionProvider session={session}>
          <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <AuthModalProvider>
              <Toaster
                position='bottom-right'
                toastOptions={{
                  duration: 3000,
                  style: { background: '#e0e0e0', color: '#161616' },
                }}
              />

              {children}
            </AuthModalProvider>
          </body>
        </SessionProvider>
      </CheckboxProvider>
    </html>
  );
}

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
                  style: {
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#f1f5f9',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                    fontSize: '0.875rem',
                  },
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

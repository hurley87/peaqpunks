import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '../components/Header';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'PeaqPunks',
  description: 'Mint your PeaqPunk',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#2f1d74]`}
      >
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

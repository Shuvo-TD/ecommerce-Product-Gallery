import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientProvider from '@/components/ClientProvider';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HuluLulu Store - E-commerce Product Gallery',
  description:
    'Browse our curated collection of premium products with advanced filtering, sorting, and a seamless shopping cart experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <Header />
          <main className='container mx-auto px-4 py-8'>{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}

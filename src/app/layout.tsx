import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Usa Inter en lugar de Geist
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App with Auth',
  description: 'Authentication with Next.js and Neon PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
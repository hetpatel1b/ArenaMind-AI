import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/index.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ArenaMind AI | Stadium Operations Copilot',
  description: 'The Intelligent Stadium Operations Copilot for modern venue management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/index.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ArenaMind AI | Venue Operations Copilot',
  description: 'The Intelligent Venue Operations Copilot for modern venue management.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://arenamind.ai',
  },
  openGraph: {
    title: 'ArenaMind AI | Venue Operations Copilot',
    description: 'The Intelligent Venue Operations Copilot for modern venue management.',
    locale: 'en_US',
    type: 'website',
    siteName: 'ArenaMind AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArenaMind AI | Venue Operations Copilot',
    description: 'The Intelligent Venue Operations Copilot for modern venue management.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

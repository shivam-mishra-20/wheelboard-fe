import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Wheelboard - Professional Transportation & Logistics Platform',
    template: '%s | Wheelboard',
  },
  description:
    'Wheelboard is a comprehensive platform connecting professionals, businesses, and companies in the transportation and logistics industry. Find jobs, manage fleets, discover services, and build your network.',
  keywords: [
    'transportation',
    'logistics',
    'trucking',
    'fleet management',
    'professional drivers',
    'freight',
    'supply chain',
    'jobs',
    'business listings',
    'wheelboard',
  ],
  authors: [{ name: 'Wheelboard Team' }],
  creator: 'Wheelboard',
  publisher: 'Wheelboard',
  applicationName: 'Wheelboard',
  category: 'Transportation & Logistics',
  classification: 'Business',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wheelboard.com',
    siteName: 'Wheelboard',
    title: 'Wheelboard - Professional Transportation & Logistics Platform',
    description:
      'Connect with professionals, find opportunities, and grow your business in the transportation and logistics industry.',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Wheelboard Logo',
        type: 'image/png',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Wheelboard - Professional Transportation & Logistics Platform',
    description:
      'Connect with professionals, find opportunities, and grow your business in the transportation and logistics industry.',
    images: ['/Logo.png'],
    creator: '@wheelboard',
    site: '@wheelboard',
  },

  // Icons
  icons: {
    icon: [
      { url: '/logo.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/Logo.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/Logo.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/logo.ico',
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Other metadata
  alternates: {
    canonical: 'https://wheelboard.com',
  },

  // Apple specific
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Wheelboard',
  },

  // Format detection
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

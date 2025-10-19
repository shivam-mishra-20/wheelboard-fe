import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';
//import LenisProvider from '@/components/LenisProvider';

// Derive site URL for metadataBase (used for resolving OG/Twitter images)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://wheelboard.com';

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
  metadataBase: new URL(siteUrl),
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
    title: 'Wheelboard - Transportation & Logistics Platform',
    description:
      'Connect with professionals, find opportunities, and grow your business in the transportation and logistics industry.',
    images: ['/Logo.png'],
    creator: '@wheelboard',
    site: '@wheelboard',
  },

  // Icons
  icons: {
    icon: [
      { url: '/Cards/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/Cards/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/Logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      {
        url: '/Cards/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/Cards/favicon-32x32.png',
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
    canonical: 'https://wheelboard.in',
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
      <head>
        {/* Ensure correct mobile scaling and prevent automatic zooming on small devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

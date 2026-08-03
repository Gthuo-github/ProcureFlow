import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import ConditionalNavbar from './dashboard/components/ConditionalNavbar';

export const metadata: Metadata = {
  title:       'ProcureFlow — Smart Procurement',
  description: 'Manage suppliers, orders, and spend in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lexend:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ConditionalNavbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HOP Contact CMS',
  description: 'Professional contact management with WordPress + WPGraphQL'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

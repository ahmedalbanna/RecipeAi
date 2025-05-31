
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'FridgeChef',
  description: 'Generate recipes from ingredients in your fridge!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* PT Sans supports Latin and Cyrillic. For Arabic, a specific font might be better or rely on system defaults. */}
          {/* Consider adding a font that explicitly supports Arabic if PT Sans doesn't render well. e.g. Noto Sans Arabic */}
          <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased min-h-screen flex flex-col">
          {children}
          <Toaster />
        </body>
      </html>
    </LanguageProvider>
  );
}

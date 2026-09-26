import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { AppShell } from '@/components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'QistBook — Digital Khata & Udhaar Manager',
  description: 'Production-ready digital credit ledger for retail shopkeepers in Pakistan with AI advisor and WhatsApp payment reminders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased relative min-h-screen">
        {/* Soft decorative background blurred ambient circles */}
        <div className="bg-ambient-primary" aria-hidden="true" />
        <div className="bg-ambient-amber" aria-hidden="true" />

        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AuthProvider>
                <AppShell>{children}</AppShell>
              </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

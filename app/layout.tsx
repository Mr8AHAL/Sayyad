import type {Metadata} from 'next';
import { Vazirmatn } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });

export const metadata: Metadata = {
  title: 'سامانه پایش صیادان',
  description: 'وب‌اپ مدیریتی ویژه صیادان',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

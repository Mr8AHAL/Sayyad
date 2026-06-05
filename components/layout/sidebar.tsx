'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Users, FileCheck, FileText, MessageSquare, Anchor, Search, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const navigation = [
  { name: 'صیادان', href: '/fishermen', icon: Users },
  { name: 'چک‌لیست تردد', href: '/traffic', icon: FileCheck },
  { name: 'صورتحساب', href: '/invoices', icon: FileText },
  { name: 'پنل پیامکی', href: '/sms', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hidden lg:block w-20 shrink-0 relative z-50">
      <div className="group/sidebar fixed right-0 top-0 bottom-0 flex flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen w-20 hover:w-64 transition-all duration-300 overflow-hidden">
        <div className="flex h-16 items-center flex-shrink-0 px-7 mt-4 text-blue-600 dark:text-blue-500 font-bold text-lg whitespace-nowrap">
          <Anchor className="w-6 h-6 shrink-0" />
          <span className="mr-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">سامانه پایش صیادان</span>
        </div>
        <nav className="flex-1 space-y-2 px-4 mt-8">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                  'group flex items-center p-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap'
                )}
                title={item.name}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500',
                    'shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <span className="mr-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center p-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 rounded-xl transition-colors whitespace-nowrap"
            title={mounted && theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
          >
            {mounted && theme === 'dark' ? <Sun className="shrink-0 h-6 w-6" /> : <Moon className="shrink-0 h-6 w-6" />}
            <span className="mr-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              {mounted && theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
            </span>
          </button>
          <button 
            className="flex w-full items-center p-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 rounded-xl transition-colors whitespace-nowrap"
            title="تنظیمات"
          >
            <Settings className="shrink-0 h-6 w-6" />
            <span className="mr-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );
}

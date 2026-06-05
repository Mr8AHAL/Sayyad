'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileCheck, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'صیادان', href: '/fishermen', icon: Users },
  { name: 'تردد', href: '/traffic', icon: FileCheck },
  { name: 'صورتحساب', href: '/invoices', icon: FileText },
  { name: 'پیامک', href: '/sms', icon: MessageSquare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-800 safe-area-bottom">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1',
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

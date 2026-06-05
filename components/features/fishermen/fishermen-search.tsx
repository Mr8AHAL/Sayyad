'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/core';
import { Search } from 'lucide-react';

export function FishermenSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce basic implementation
    setTimeout(() => {
      router.push(`/fishermen?${createQueryString('q', value)}`);
    }, 300);
  };

  return (
    <div className="flex items-center w-full sm:w-auto max-w-lg flex-1 relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input 
        value={query}
        onChange={handleSearch}
        placeholder="جستجو در صیادان (نام، کد، ثبت، ملی، موبایل)..." 
        className="w-full pr-10 text-base py-5 rounded-2xl shadow-sm border-gray-200 dark:border-gray-800"
      />
    </div>
  );
}

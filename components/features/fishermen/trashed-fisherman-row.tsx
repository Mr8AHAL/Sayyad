'use client';

import { useState } from 'react';
import { restoreFisherman } from '@/actions/fishermen';
import { Button } from '@/components/ui/core';
import { RefreshCcw } from 'lucide-react';

export function TrashedFishermanRow({ fisherman }: { fisherman: any }) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    await restoreFisherman(fisherman.id);
    setIsRestoring(false);
  };

  return (
    <div className="relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Mobile */}
      <div className="sm:hidden p-4 space-y-2 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{fisherman.fullName}</span>
          <span className="text-gray-500 font-mono text-sm">{fisherman.fishermanCode}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>ثبت: <span className="font-mono">{fisherman.registrationNumber}</span></span>
          <Button variant="ghost" size="sm" onClick={handleRestore} isLoading={isRestoring} className="text-blue-600 hover:text-blue-700 h-8">
            <RefreshCcw className="h-4 w-4 ml-1" /> بازیابی
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-gray-700 dark:text-gray-300">
        <div className="col-span-2 text-center font-mono text-gray-500">{fisherman.fishermanCode}</div>
        <div className="col-span-4 font-medium text-gray-900 dark:text-gray-100 truncate pr-2">
          {fisherman.fullName}
        </div>
        <div className="col-span-2 text-center font-mono">{fisherman.registrationNumber}</div>
        <div className="col-span-3 text-center text-gray-400" dir="ltr">
          {new Date(fisherman.deletedAt).toLocaleDateString('fa-IR')}
        </div>
        <div className="col-span-1 flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleRestore} isLoading={isRestoring} className="h-8 w-8 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Pin, Eye, Edit2, Trash2, Copy, Tag, ListPlus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/core';
import { cn } from '@/lib/utils';

interface Fisherman {
  id: string;
  fishermanCode: number;
  fullName: string;
  registrationNumber: string;
  daysLeft: number;
  isAutoPinned: boolean;
  manualPinned: boolean;
  paymentStatusTag: string | null;
}

export function FishermanRow({ fisherman }: { fisherman: Fisherman }) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchTimer.current = setTimeout(() => {
      setContextMenu({ x: touch.clientX, y: touch.clientY });
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  const handleTouchMove = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('contextmenu', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <>
      <div 
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {/* Mobile Card */}
        <div className="sm:hidden p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                {fisherman.fullName}
                {(fisherman.isAutoPinned || fisherman.manualPinned) && (
                  <Pin className="h-3 w-3 text-red-500 opacity-70" />
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">شناسه: {fisherman.fishermanCode}</div>
            </div>
            <div className="text-left">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                fisherman.daysLeft < 30 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              )}>
                {fisherman.daysLeft} روز
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">ثبت: <span className="font-mono">{fisherman.registrationNumber}</span></span>
            <div className="flex gap-2">
               {fisherman.paymentStatusTag && (
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-md truncate max-w-full",
                    fisherman.paymentStatusTag === 'اولویت' ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                    fisherman.paymentStatusTag === 'خوش‌حساب' ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                    fisherman.paymentStatusTag === 'بدحساب' ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                    "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}>
                    {fisherman.paymentStatusTag}
                  </span>
                )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setContextMenu({ x: rect.right, y: rect.bottom });
            }}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Row */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-gray-700 dark:text-gray-300">
          <div className="col-span-2 text-center font-mono text-gray-500">{fisherman.fishermanCode}</div>
          <div className="col-span-3 font-medium text-gray-900 dark:text-gray-100 truncate pr-2 flex items-center gap-2">
            {fisherman.fullName}
            {(fisherman.isAutoPinned || fisherman.manualPinned) && (
              <Pin className="h-3 w-3 text-red-500 opacity-70" />
            )}
          </div>
          <div className="col-span-2 text-center font-mono">{fisherman.registrationNumber}</div>
          <div className="col-span-1 text-center font-medium">
            <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                fisherman.daysLeft < 30 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-transparent text-gray-700 dark:text-gray-300"
              )}>
                {fisherman.daysLeft}
            </span>
          </div>
          <div className="col-span-3 flex justify-center gap-1 flex-wrap">
            {fisherman.paymentStatusTag && (
              <span className={cn(
                "px-2 py-1 text-xs rounded-md truncate max-w-full",
                fisherman.paymentStatusTag === 'اولویت' ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                fisherman.paymentStatusTag === 'خوش‌حساب' ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                fisherman.paymentStatusTag === 'بدحساب' ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              )}>
                {fisherman.paymentStatusTag}
              </span>
            )}
            {/* More tags logic here */}
          </div>
          <div className="col-span-1 flex justify-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setContextMenu({ x: rect.right, y: rect.bottom });
            }}>
               <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 text-sm overflow-hidden"
          style={{ 
             top: Math.min(contextMenu.y, window.innerHeight - 250), 
             left: Math.min(contextMenu.x, window.innerWidth - 200) 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Pin className="h-4 w-4" />
            پین
          </button>
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Copy className="h-4 w-4" />
            کپی
          </button>
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ListPlus className="h-4 w-4" />
            انتقال به لیست
          </button>
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Tag className="h-4 w-4" />
            تغییر برچسب
          </button>
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Eye className="h-4 w-4" />
            پروفایل
          </button>
          <button className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Edit2 className="h-4 w-4" />
            ویرایش
          </button>
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
          <button className="w-full text-right px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-4 w-4" />
            انتقال به سطل زباله
          </button>
        </div>
      )}
    </>
  );
}

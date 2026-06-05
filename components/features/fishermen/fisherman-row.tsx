'use client';

import { useState } from 'react';
import { pinFisherman, unpinFisherman } from '@/actions/fishermen';
import { ContextMenu } from '@/components/ui/context-menu';
import { Button } from '@/components/ui/core';
import { Pin, Copy, Folder, Tag, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
// We assume we have these components or will create them:
import { MoveToTrashDialog } from './move-to-trash-dialog';
import { EditFishermanDialog } from './edit-fisherman-dialog';
// import { ProfileDialog } from './profile-dialog'; // for later

import Link from 'next/link';

interface FishermanRowProps {
  fisherman: any;
  allFishermenLength: number;
}

export function FishermanRow({ fisherman }: FishermanRowProps) {
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handlePin = async () => {
    if (fisherman.manualPinned) {
      await unpinFisherman(fisherman.id);
    } else {
      await pinFisherman(fisherman.id);
    }
  };

  const contextMenuItems = (
    <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
      <button onClick={handlePin} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors">
        <Pin className="h-4 w-4 text-gray-400" />
        <span>{fisherman.manualPinned ? 'برداشتن پین' : 'پین دستی'}</span>
      </button>
      <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors">
        <Copy className="h-4 w-4 text-gray-400" />
        <span>کپی</span>
      </button>
      <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors">
        <Folder className="h-4 w-4 text-gray-400" />
        <span>انتقال به لیست</span>
      </button>
      <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors">
        <Tag className="h-4 w-4 text-gray-400" />
        <span>افزودن یا تغییر برچسب</span>
      </button>
      <hr className="my-1 border-gray-100 dark:border-gray-800" />
      <Link href={`/fishermen/${fisherman.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors text-blue-600 dark:text-blue-400">
        <Eye className="h-4 w-4" />
        <span>مشاهده / پروفایل</span>
      </Link>
      <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-right w-full transition-colors">
        <Edit2 className="h-4 w-4 text-gray-400" />
        <span>ویرایش</span>
      </button>
      <hr className="my-1 border-gray-100 dark:border-gray-800" />
      <button onClick={() => setIsTrashOpen(true)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-right w-full transition-colors text-red-600 dark:text-red-400">
        <Trash2 className="h-4 w-4" />
        <span>انتقال به سطل زباله</span>
      </button>
    </div>
  );

  return (
    <>
      <ContextMenu menu={contextMenuItems}>
        <div className="relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          {/* Mobile Card / Desktop Row */}
          <div className="sm:hidden p-3 flex items-center justify-between text-xs border-b border-gray-100 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:overflow-x-auto hide-scrollbar flex-1 pr-2">
              <span className="text-gray-500 font-mono opacity-80">{fisherman.fishermanCode}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{fisherman.fullName}</span>
              {(fisherman.isAutoPinned || fisherman.manualPinned) && (
                <Pin className="inline h-3 w-3 text-red-500 opacity-70 flex-shrink-0" />
              )}
              <span className="text-gray-400 font-mono text-[10px]">{fisherman.registrationNumber}</span>
              <span className={cn(
                  "px-1.5 py-0.5 rounded",
                  fisherman.daysLeft < 30 ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              )}>
                 {fisherman.daysLeft} روز
              </span>
              {fisherman.paymentStatusTag && (
                <div className="flex items-center gap-1">
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px]">
                        {fisherman.paymentStatusTag}
                    </span>
                </div>
              )}
              {/* Folder info as per requirement: نام پوشه‌ای که لیست صیاد داخل آن قرار دارد. We don't have lists fetched right now, static for now */}
            </div>
            {/* The ... menu icon is a backup for context menu */}
            <div className="dropdown relative shrink-0">
               <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 ml-1 hover:text-gray-900 dark:hover:text-gray-100">
                  <MoreVertical className="h-4 w-4" />
               </Button>
               {/* Could add a traditional dropdown here if we want to fallback from context menu for those clicking */}
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-gray-700 dark:text-gray-300">
            <div className="col-span-2 text-center font-mono text-gray-500">{fisherman.fishermanCode}</div>
            <div className="col-span-3 font-medium text-gray-900 dark:text-gray-100 truncate pr-2">
              {fisherman.fullName}
              {(fisherman.isAutoPinned || fisherman.manualPinned) && (
                <Pin className="inline ml-2 h-3 w-3 text-red-500 opacity-70" />
              )}
            </div>
            <div className="col-span-2 text-center font-mono">{fisherman.registrationNumber}</div>
            <div className={cn("col-span-2 text-center font-medium", fisherman.daysLeft < 30 ? "text-red-600 dark:text-red-400" : "")}>
              {fisherman.daysLeft} روز
            </div>
            <div className="col-span-2 flex justify-center gap-1 flex-wrap">
              {fisherman.paymentStatusTag && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md dark:bg-blue-900/30 dark:text-blue-300 truncate max-w-full">
                  {fisherman.paymentStatusTag}
                </span>
              )}
            </div>
            <div className="col-span-1 flex justify-center gap-2">
               {/* Quick operations logic */}
               <Link href={`/fishermen/${fisherman.id}`}>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hidden lg:flex">
                   <Eye className="h-4 w-4" />
                 </Button>
               </Link>
               <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)} className="h-8 w-8 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hidden lg:flex">
                 <Edit2 className="h-4 w-4" />
               </Button>
               <Button variant="ghost" size="icon" onClick={() => setIsTrashOpen(true)} className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hidden lg:flex">
                 <Trash2 className="h-4 w-4" />
               </Button>
               <div className="dropdown relative group/dd lg:hidden">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <div className="absolute left-0 top-full mt-1 hidden group-hover/dd:block z-50 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl py-2">
                     {contextMenuItems}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </ContextMenu>
      
      {isTrashOpen && (
         <MoveToTrashDialog 
            isOpen={isTrashOpen} 
            onClose={() => setIsTrashOpen(false)} 
            fishermanId={fisherman.id} 
            fishermanName={fisherman.fullName} 
         />
      )}

      {isEditOpen && (
         <EditFishermanDialog
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            fisherman={fisherman}
         />
      )}
    </>
  );
}

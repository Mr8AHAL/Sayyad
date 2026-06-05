import { getFishermen } from '@/actions/fishermen';
import { Button, Input } from '@/components/ui/core';
import { cn } from '@/lib/utils';
import { Search, Plus, MoreVertical, Edit2, Trash2, Pin, Eye } from 'lucide-react';
import { daysBetweenDates, toGregorian } from '@/lib/jalali';
import { AddFishermanButton, AddFishermanFloatingButton } from '@/components/features/fishermen/add-fisherman-buttons';
import { FishermanRow } from '@/components/features/fishermen/fisherman-row';
import { FishermenSearch } from '@/components/features/fishermen/fishermen-search';
import Link from 'next/link';

function calculateDaysLeft(jalaliDate: string) {
  const target = toGregorian(jalaliDate);
  if (!target) return 0;
  return daysBetweenDates(new Date(), target);
}

export default async function FishermenPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : '';
  const filterPayment = typeof resolvedParams.payment === 'string' ? resolvedParams.payment : '';

  const fishermenList = await getFishermen();

  // Enhance list with computed days left and auto-pin
  let enhancedList = fishermenList.map(f => {
    const daysLeft = calculateDaysLeft(f.classificationDateJalali);
    const isAutoPinned = daysLeft < 30;
    return { ...f, daysLeft, isAutoPinned };
  });

  if (q) {
    enhancedList = enhancedList.filter(f => 
      f.fullName.toLowerCase().includes(q) ||
      f.fishermanCode.toString().includes(q) ||
      f.registrationNumber.includes(q) ||
      (f.phone && f.phone.includes(q)) ||
      (f.nationalCode && f.nationalCode.includes(q))
    );
  }
  
  if (filterPayment) {
    enhancedList = enhancedList.filter(f => f.paymentStatusTag === filterPayment);
  }

  enhancedList = enhancedList.sort((a, b) => {
    // Priority: Auto Pinned -> Manual Pinned -> ID asc
    if (a.isAutoPinned && !b.isAutoPinned) return -1;
    if (!a.isAutoPinned && b.isAutoPinned) return 1;
    if (a.manualPinned && !b.manualPinned) return -1;
    if (!a.manualPinned && b.manualPinned) return 1;
    if (a.isAutoPinned && b.isAutoPinned) return a.daysLeft - b.daysLeft;
    return a.fishermanCode - b.fishermanCode;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FishermenSearch />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 font-vazir">
              <div className="col-span-2 text-center">کد / شناسه</div>
              <div className="col-span-3">نام و نام خانوادگی</div>
              <div className="col-span-2 text-center">شماره ثبت</div>
              <div className="col-span-2 text-center">روز تا رده‌بندی</div>
              <div className="col-span-2 text-center">برچسب‌ها</div>
              <div className="col-span-1 text-center">عملیات</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {enhancedList.length === 0 ? (
                <div className="py-12 text-center text-gray-500">هیچ صیادی یافت نشد.</div>
              ) : (
                enhancedList.map((fisherman) => (
                  <FishermanRow 
                    key={fisherman.id} 
                    fisherman={fisherman} 
                    allFishermenLength={enhancedList.length} 
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary / Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">عملیات اصلی</h3>
            <div className="space-y-2">
              <AddFishermanButton />
              <Link href="/fishermen/trash" className="block w-full">
                <Button variant="ghost" className="w-full justify-between pr-4 pl-3 !h-12 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  سطل زباله
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">لیست‌ها</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-4 w-4"/></Button>
            </div>
            <div className="space-y-1">
              <button className="flex justify-between items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>کل صیادان</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{enhancedList.length}</span>
              </button>
              <button className="flex justify-between items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>نیاز به تمدید</span>
                <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-xs">
                  {enhancedList.filter(f => f.daysLeft < 30).length}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button for mobile */}
      <div className="lg:hidden fixed bottom-20 left-4 z-50">
        <AddFishermanFloatingButton />
      </div>
    </div>
  );
}

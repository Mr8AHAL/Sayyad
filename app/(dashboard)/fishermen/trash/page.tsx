import { getTrashedFishermen } from '@/actions/fishermen';
import { TrashedFishermanRow } from '@/components/features/fishermen/trashed-fisherman-row';
import { Button } from '@/components/ui/core';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function FishermenTrashPage() {
  const trashedList = await getTrashedFishermen();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/fishermen">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">سطل زباله صیادان</h1>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 font-vazir">
          <div className="col-span-2 text-center">کد / شناسه</div>
          <div className="col-span-4">نام و نام خانوادگی</div>
          <div className="col-span-2 text-center">شماره ثبت</div>
          <div className="col-span-3 text-center">تاریخ حذف</div>
          <div className="col-span-1 text-center">عملیات</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {trashedList.length === 0 ? (
            <div className="py-12 text-center text-gray-500">سطل زباله خالی است.</div>
          ) : (
            trashedList.map((fisherman) => (
              <TrashedFishermanRow key={fisherman.id} fisherman={fisherman} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { getFishermen } from '@/actions/fishermen';
import { getFishermanFiles } from '@/actions/fisherman-files';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/core';
import { ArrowRight, User, Calendar, MapPin, Anchor, Phone, CreditCard, Droplets, Fingerprint, History } from 'lucide-react';
import Link from 'next/link';
import { FishermanFilesManager } from '@/components/features/fishermen/fisherman-files-manager';
import { cn } from '@/lib/utils';
import { daysBetweenDates, toGregorian } from '@/lib/jalali';

function calculateDaysLeft(jalaliDate: string) {
  const target = toGregorian(jalaliDate);
  if (!target) return 0;
  return daysBetweenDates(new Date(), target);
}

export default async function FishermanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const fishermenList = await getFishermen();
  const fisherman = fishermenList.find(f => f.id === resolvedParams.id);
  
  if (!fisherman) {
    notFound();
  }

  const files = await getFishermanFiles(fisherman.id);
  const daysLeft = calculateDaysLeft(fisherman.classificationDateJalali);

  const mainDocsKeys = ['profile', 'national_card', 'tasht_invoice', 'sanad', 'classification', 'gol', 'captain_card'];
  const uploadedMainDocs = files.filter(f => mainDocsKeys.includes(f.fileType)).length;
  const isDocsComplete = uploadedMainDocs === mainDocsKeys.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-4">
           <Link href="/fishermen">
             <Button variant="ghost" size="icon" className="h-10 w-10">
               <ArrowRight className="h-5 w-5" />
             </Button>
           </Link>
           <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
               {fisherman.fullName}
               <span className="text-sm font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-lg pb-0.5">
                 شناسه: {fisherman.fishermanCode}
               </span>
             </h1>
           </div>
        </div>
        
        {files.length > 0 && (
          <a href={`/api/fishermen/${fisherman.id}/zip`}>
             <Button variant="outline" className="hidden sm:flex" size="sm">
                دانلود کل پرونده (ZIP)
             </Button>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
             
             <div className="relative z-10 space-y-6 flex flex-col items-center pb-2 border-b border-gray-100 dark:border-gray-800 mb-6">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                  <User className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1">
                   <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{fisherman.fullName}</h2>
                   <p className="text-sm text-gray-500 font-mono">شماره ثبت: {fisherman.registrationNumber}</p>
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><Anchor className="w-4 h-4" /> تاریخ رده‌بندی</span>
                 <span className="font-semibold text-gray-900 dark:text-gray-100" dir="ltr">{fisherman.classificationDateJalali}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">روز باقیمانده</span>
                 <span className={cn(
                    "px-2 py-1 rounded font-medium",
                    daysLeft < 30 ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                 )}>
                   {daysLeft} روز
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><Droplets className="w-4 h-4" /> جایگاه سوخت</span>
                 <span className="font-semibold text-gray-900 dark:text-gray-100">{fisherman.fuelStation || '—'}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> صیدگاه</span>
                 <span className="font-semibold text-gray-900 dark:text-gray-100">{fisherman.fishingArea || '—'}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> وضعیت پرداخت</span>
                 {fisherman.paymentStatusTag ? (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md dark:bg-blue-900/30 dark:text-blue-300">
                      {fisherman.paymentStatusTag}
                    </span>
                 ) : (
                    <span className="text-gray-400">—</span>
                 )}
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">وضعیت مدارک</span>
                 {isDocsComplete ? (
                    <span className="text-green-600 dark:text-green-400 font-medium text-xs">کامل</span>
                 ) : (
                    <span className="text-orange-600 dark:text-orange-400 font-medium text-xs">ناقص</span>
                 )}
               </div>
             </div>
          </div>

          {/* Internal Notes Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
             <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
               یادداشت داخلی
             </h3>
             {fisherman.internalNote ? (
               <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {fisherman.internalNote}
               </p>
             ) : (
               <p className="text-sm text-gray-400 italic">یادداشتی ثبت نشده است.</p>
             )}
          </div>
        </div>

        {/* Right Column: Detailed Info & Files */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-6">اطلاعات تکمیلی فردی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">نام پدر</label>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{fisherman.fatherName || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">کد ملی</label>
                  <div className="font-medium font-mono text-gray-900 dark:text-gray-100">{fisherman.nationalCode || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">تاریخ تولد</label>
                  <div className="font-medium text-gray-900 dark:text-gray-100" dir="ltr">{fisherman.birthDateJalali || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" /> شماره تماس</label>
                  <div className="font-medium font-mono text-gray-900 dark:text-gray-100" dir="ltr">{fisherman.phone || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1"><History className="w-3 h-3" /> تاریخ ثبت در سیستم</label>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100" dir="ltr">
                     {new Date(fisherman.createdAt).toLocaleDateString('fa-IR')}
                  </div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">تاریخ آخرین ویرایش</label>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100" dir="ltr">
                     {new Date(fisherman.updatedAt).toLocaleDateString('fa-IR')}
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-gray-400" /> مشخصات موتور
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">شماره موتور</label>
                  <div className="font-medium font-mono text-gray-900 dark:text-gray-100">{fisherman.engineNumber || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">نوع موتور</label>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{fisherman.engineType || '—'}</div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">قدرت موتور</label>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{fisherman.enginePower || '—'}</div>
               </div>
            </div>
          </div>

          {/* Files Manager Component */}
          <FishermanFilesManager fishermanId={fisherman.id} files={files} />
        </div>
      </div>
    </div>
  );
}

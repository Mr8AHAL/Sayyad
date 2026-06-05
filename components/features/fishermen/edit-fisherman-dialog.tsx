'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateFisherman } from '@/actions/fishermen';
import { Button, Input } from '@/components/ui/core';
import { Modal } from '@/components/ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fisherman: any;
}

export function EditFishermanDialog({ isOpen, onClose, fisherman }: Props) {
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (isOpen && fisherman) {
      setError(null);
      reset({
        ...fisherman,
        fishermanCode: fisherman.fishermanCode,
        registrationNumber: fisherman.registrationNumber,
        classificationDateJalali: fisherman.classificationDateJalali,
      });
    }
  }, [isOpen, fisherman, reset]);

  const onSubmit = async (data: any) => {
    setError(null);
    const res = await updateFisherman(fisherman.id, data);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'خطایی رخ داد.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ویرایش اطلاعات صیاد">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh] overflow-y-auto hide-scrollbar pr-2 pb-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نام و نام خانوادگی *</label>
            <Input {...register('fullName', { required: true })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره ثبت *</label>
            <Input {...register('registrationNumber', { required: true })} dir="ltr" className="text-right" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تاریخ رده‌بندی (شمسی) *</label>
            <Input 
              {...register('classificationDateJalali', { required: true })} 
              dir="ltr" className="text-right" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شناسه صیاد</label>
            <Input {...register('fishermanCode')} disabled dir="ltr" className="text-right bg-gray-50 dark:bg-gray-800 disabled:opacity-50" />
            <span className="text-xs text-gray-400">شناسه قابل تغییر نیست.</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره تماس</label>
            <Input {...register('phone')} dir="ltr" className="text-right" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نام پدر</label>
            <Input {...register('fatherName')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تاریخ تولد (شمسی)</label>
            <Input {...register('birthDateJalali')} dir="ltr" className="text-right" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">کد ملی</label>
            <Input {...register('nationalCode')} dir="ltr" className="text-right" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">صیدگاه</label>
            <Input {...register('fishingArea')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">جایگاه سوخت</label>
            <Input {...register('fuelStation')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تگ وضعیت پرداخت</label>
            <select 
              {...register('paymentStatusTag')}
              className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">بدون تگ</option>
              <option value="اولویت">اولویت</option>
              <option value="خوش‌حساب">خوش‌حساب</option>
              <option value="بدحساب">بدحساب</option>
              <option value="بی‌خیال">بی‌خیال</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره موتور</label>
            <Input {...register('engineNumber')} dir="ltr" className="text-right" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع موتور</label>
            <Input {...register('engineType')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">قدرت موتور</label>
            <Input {...register('enginePower')} dir="ltr" className="text-right" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">یادداشت داخلی</label>
            <textarea 
              {...register('internalNote')}
              className="flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-900 mt-4 rounded-xl border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="px-8 flex-1 sm:flex-none">
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </Modal>
  );
}

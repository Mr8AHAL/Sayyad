'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/core';
import { moveFishermanToTrash } from '@/actions/fishermen';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fishermanId: string;
  fishermanName: string;
}

export function MoveToTrashDialog({ isOpen, onClose, fishermanId, fishermanName }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    const res = await moveFishermanToTrash(fishermanId);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'خطایی رخ داد.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ارسال به سطل زباله">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          آیا مطمئن هستید این صیاد ({fishermanName}) به سطل زباله منتقل شود؟
        </p>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>انصراف</Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isSubmitting}>انتقال به زباله‌دان</Button>
        </div>
      </div>
    </Modal>
  );
}

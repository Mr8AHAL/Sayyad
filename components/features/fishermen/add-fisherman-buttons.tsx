'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/core';
import { Plus } from 'lucide-react';
import { CreateFishermanDialog } from './create-fisherman-dialog';

export function AddFishermanButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)} className="w-full justify-between pr-4 pl-3 !h-12 shadow-blue-500/20 shadow-lg">
        افزودن صیاد جدید
        <Plus className="h-5 w-5 bg-white/20 rounded-lg p-0.5" />
      </Button>
      <CreateFishermanDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export function AddFishermanFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)} className="h-14 w-14 rounded-full shadow-lg shadow-blue-500/30">
        <Plus className="h-6 w-6" />
      </Button>
      <CreateFishermanDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

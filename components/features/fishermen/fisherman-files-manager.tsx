'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/core';
import { UploadCloud, Eye, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFishermanFile } from '@/actions/fisherman-files';
import Link from 'next/link';

interface FishermanFilesManagerProps {
  fishermanId: string;
  files: any[];
}

const MAIN_DOCS = [
  { key: 'profile', label: 'عکس پروفایل' },
  { key: 'national_card', label: 'کارت ملی' },
  { key: 'tasht_invoice', label: 'فاکتور تشت' },
  { key: 'sanad', label: 'سند و اصلاحی سند' },
  { key: 'classification', label: 'رده‌بندی' },
  { key: 'gol', label: 'گول' },
  { key: 'captain_card', label: 'کارت ناخدایی' },
];

const ENGINE_DOCS = [
  { key: 'engine', label: 'عکس موتور' },
  { key: 'reflector', label: 'عکس شبرنگ' },
  { key: 'metal_plate', label: 'عکس پلاک فلزی' },
];

export function FishermanFilesManager({ fishermanId, files }: FishermanFilesManagerProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingKey(fileType);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fishermanId', fishermanId);
    formData.append('fileType', fileType);

    const res = await uploadFishermanFile(formData);
    
    setUploadingKey(null);
    if (!res.success) {
      setError(res.error || 'خطا در بارگذاری فایل');
    }
    // reset input
    e.target.value = '';
  };

  const getFile = (key: string) => files.find(f => f.fileType === key);

  const renderDocCard = (doc: { key: string, label: string }) => {
    const file = getFile(doc.key);
    
    return (
      <div key={doc.key} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${file ? 'bg-green-50 text-green-600 dark:bg-green-900/30' : 'bg-gray-50 text-gray-400 dark:bg-gray-800'}`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{doc.label}</h4>
            <p className="text-xs mt-1 text-gray-500">
              {file ? 'بارگذاری شده' : 'فایلی ثبت نشده است'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {file ? (
            <>
              <a href={file.filePath} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Eye className="h-4 w-4" />
                </Button>
              </a>
              <a href={file.filePath} download={file.originalName}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </>
          ) : (
            <div className="relative">
              <Button variant="ghost" size="sm" isLoading={uploadingKey === doc.key} className="h-8 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                <UploadCloud className="h-4 w-4 ml-1" />
                بارگذاری
              </Button>
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.pdf"
                title="بارگذاری"
                onChange={(e) => handleFileChange(e, doc.key)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const mainDocsRatio = MAIN_DOCS.filter(d => getFile(d.key)).length;
  const isMainDocsComplete = mainDocsRatio === MAIN_DOCS.length;

  return (
    <div className="space-y-8 mt-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main Docs */}
      <section>
        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3 mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-3">
             مدارک اصلی
             {mainDocsRatio > 0 && (
               <a href={`/api/fishermen/${fishermanId}/zip?type=main`}>
                 <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-gray-900">
                    <Download className="w-3.5 h-3.5 ml-1" /> یکجا
                 </Button>
               </a>
             )}
          </h3>
          <div className="flex items-center gap-3">
             <div className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 font-mono">
               بارگذاری شده: {mainDocsRatio} از {MAIN_DOCS.length}
             </div>
             {isMainDocsComplete ? (
               <span className="text-sm px-3 py-1 flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                 <CheckCircle2 className="h-4 w-4" /> کامل
               </span>
             ) : (
               <span className="text-sm px-3 py-1 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg">
                 ناقص
               </span>
             )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MAIN_DOCS.map(renderDocCard)}
        </div>
      </section>

      {/* Engine Docs */}
      <section>
        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-3 mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-3">
             فایل‌ها و عکس‌های موتور
             {ENGINE_DOCS.some(d => getFile(d.key)) && (
               <a href={`/api/fishermen/${fishermanId}/zip?type=engine`}>
                 <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-gray-900">
                    <Download className="w-3.5 h-3.5 ml-1" /> یکجا
                 </Button>
               </a>
             )}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ENGINE_DOCS.map(renderDocCard)}
        </div>
      </section>
    </div>
  );
}

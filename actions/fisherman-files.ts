'use server';

import { db } from '@/lib/db';
import { fishermanFiles, fishermen } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

export async function uploadFishermanFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const fishermanId = formData.get('fishermanId') as string;
    const fileType = formData.get('fileType') as string;

    if (!file || !(file instanceof File)) {
      throw new Error('فایلی برای بارگذاری انتخاب نشده است.');
    }

    if (!fishermanId || !fileType) {
      throw new Error('اطلاعات ناقص است.');
    }

    const ext = path.extname(file.name).toLowerCase();
    
    if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error('فرمت فایل مجاز نیست. فقط فایل‌های JPG، PNG و PDF قابل بارگذاری هستند.');
    }

    const fishermanRecord = await db.query.fishermen.findFirst({
      where: eq(fishermen.id, fishermanId)
    });

    if (!fishermanRecord) {
      throw new Error('صیاد یافت نشد.');
    }

    const folderName = fishermanRecord.registrationFolderName;
    
    // Create base path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'fishermen', folderName, fileType);
    
    await mkdir(uploadDir, { recursive: true });

    const now = new Date();
    const dateStr = now.toISOString().replace(/T/, '_').replace(/:/g, '').split('.')[0]; // YYYY-MM-DD_HHMMSS
    const safeDateStr = dateStr.replace(/-/g, '_');

    const storedName = `${fileType}_${safeDateStr}${ext}`;
    const filePath = `/uploads/fishermen/${folderName}/${fileType}/${storedName}`;
    const absolutePath = path.join(uploadDir, storedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absolutePath, buffer);

    await db.insert(fishermanFiles).values({
      id: crypto.randomUUID(),
      fishermanId,
      fileType,
      originalName: file.name,
      storedName,
      filePath,
      mimeType: file.type,
      fileSize: file.size,
    });

    revalidatePath(`/fishermen/${fishermanId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFishermanFiles(fishermanId: string) {
  return await db.query.fishermanFiles.findMany({
    where: eq(fishermanFiles.fishermanId, fishermanId)
  });
}

'use server';

import { db } from '@/lib/db';
import { fishermen } from '@/db/schema';
import { eq, isNull, desc, asc, not, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { persianNumbersToEnglish, toGregorian } from '@/lib/jalali';
import { generateToken } from '@/lib/utils';

export async function getFishermen() {
  const allFishermen = await db
    .select()
    .from(fishermen)
    .where(isNull(fishermen.deletedAt))
    .orderBy(desc(fishermen.manualPinned), asc(fishermen.fishermanCode));

  return allFishermen;
}

export async function getNextAvailableFishermanCode() {
  const allUsed = await db
    .select({ code: fishermen.fishermanCode })
    .from(fishermen);
  const usedCodes = new Set(allUsed.map((f) => f.code));
  let nextCode = 1;
  while (usedCodes.has(nextCode)) {
    nextCode++;
  }
  return nextCode;
}

export async function createFisherman(data: any) {
  try {
    const code = Number(persianNumbersToEnglish(data.fishermanCode?.toString() || ''));

    const nextCode = await getNextAvailableFishermanCode();
    // Validate uniqueness of code if provided
    if (data.fishermanCode) {
      if (isNaN(code) || code <= 0) {
        throw new Error('شناسه صیاد نامعتبر است');
      }
      const existing = await db
        .select()
        .from(fishermen)
        .where(
          sql`${fishermen.fishermanCode} = ${code}`
        );
      if (existing.length > 0) {
        throw new Error('این شناسه تکراری است.');
      }
    }
    
    let registrationNumber = persianNumbersToEnglish(data.registrationNumber?.toString() || '');
    if (!registrationNumber.includes('/')) {
      throw new Error('فرمت شماره ثبت صحیح نیست. باید شامل / باشد.');
    }
    const regFolder = registrationNumber.replace('/', '-');

    const existingReg = await db
      .select()
      .from(fishermen)
      .where(
        sql`${fishermen.registrationNumber} = ${registrationNumber}`
      );
    if (existingReg.length > 0) {
      throw new Error('این شماره ثبت تکراری است.');
    }

    const jalaliDate = data.classificationDateJalali;
    const gregDate = toGregorian(jalaliDate);
    if (!gregDate) {
      throw new Error('تاریخ رده‌بندی نامعتبر است.');
    }

    const birthGreg = data.birthDateJalali ? toGregorian(data.birthDateJalali) : null;

    await db.insert(fishermen).values({
      id: uuidv4(),
      fishermanCode: data.fishermanCode ? code : nextCode,
      fullName: data.fullName,
      registrationNumber,
      registrationFolderName: regFolder,
      classificationDateJalali: jalaliDate,
      classificationDateGregorian: gregDate.toISOString(),
      phone: data.phone ? persianNumbersToEnglish(data.phone) : null,
      fatherName: data.fatherName || null,
      birthDateJalali: data.birthDateJalali || null,
      birthDateGregorian: birthGreg ? birthGreg.toISOString() : null,
      nationalCode: data.nationalCode ? persianNumbersToEnglish(data.nationalCode) : null,
      fishingArea: data.fishingArea || null,
      fuelStation: data.fuelStation || null,
      paymentStatusTag: data.paymentStatusTag || null,
      internalNote: data.internalNote || null,
      engineNumber: data.engineNumber ? persianNumbersToEnglish(data.engineNumber) : null,
      engineType: data.engineType || null,
      enginePower: data.enginePower ? persianNumbersToEnglish(data.enginePower) : null,
      publicInvoiceToken: generateToken(),
    });

    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFisherman(id: string, data: any) {
  try {
    let registrationNumber = persianNumbersToEnglish(data.registrationNumber?.toString() || '');
    if (!registrationNumber.includes('/')) {
      throw new Error('فرمت شماره ثبت صحیح نیست. باید شامل / باشد.');
    }
    const regFolder = registrationNumber.replace('/', '-');

    const existingReg = await db
      .select()
      .from(fishermen)
      .where(
        sql`${fishermen.registrationNumber} = ${registrationNumber} AND ${fishermen.id} != ${id}`
      );
    if (existingReg.length > 0) {
      throw new Error('این شماره ثبت برای صیاد دیگری ثبت شده است.');
    }
    
    // Check if registration folder is changing
    const oldRecord = await db.query.fishermen.findFirst({
      where: eq(fishermen.id, id)
    });
    
    if (oldRecord && oldRecord.registrationFolderName !== regFolder) {
      // Need to rename folder and update db paths
      const fs = require('fs');
      const path = require('path');
      const oldFolder = path.join(process.cwd(), 'public', 'uploads', 'fishermen', oldRecord.registrationFolderName);
      const newFolder = path.join(process.cwd(), 'public', 'uploads', 'fishermen', regFolder);
      
      if (fs.existsSync(oldFolder)) {
         fs.renameSync(oldFolder, newFolder);
         
         const { fishermanFiles } = require('@/db/schema');
         const files = await db.select().from(fishermanFiles).where(eq(fishermanFiles.fishermanId, id));
         for (const file of files) {
           const newPath = file.filePath.replace(`/uploads/fishermen/${oldRecord.registrationFolderName}/`, `/uploads/fishermen/${regFolder}/`);
           await db.update(fishermanFiles).set({ filePath: newPath }).where(eq(fishermanFiles.id, file.id));
         }
      }
    }

    const jalaliDate = data.classificationDateJalali;
    const gregDate = toGregorian(jalaliDate);
    if (!gregDate) {
      throw new Error('تاریخ رده‌بندی نامعتبر است.');
    }

    const birthGreg = data.birthDateJalali ? toGregorian(data.birthDateJalali) : null;

    await db.update(fishermen).set({
      fullName: data.fullName,
      registrationNumber,
      registrationFolderName: regFolder,
      classificationDateJalali: jalaliDate,
      classificationDateGregorian: gregDate.toISOString(),
      phone: data.phone ? persianNumbersToEnglish(data.phone) : null,
      fatherName: data.fatherName || null,
      birthDateJalali: data.birthDateJalali || null,
      birthDateGregorian: birthGreg ? birthGreg.toISOString() : null,
      nationalCode: data.nationalCode ? persianNumbersToEnglish(data.nationalCode) : null,
      fishingArea: data.fishingArea || null,
      fuelStation: data.fuelStation || null,
      paymentStatusTag: data.paymentStatusTag || null,
      internalNote: data.internalNote || null,
      engineNumber: data.engineNumber ? persianNumbersToEnglish(data.engineNumber) : null,
      engineType: data.engineType || null,
      enginePower: data.enginePower ? persianNumbersToEnglish(data.enginePower) : null,
      updatedAt: new Date().toISOString(),
    }).where(eq(fishermen.id, id));

    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function moveFishermanToTrash(id: string) {
  try {
    await db.update(fishermen).set({ deletedAt: new Date().toISOString() }).where(eq(fishermen.id, id));
    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'خطا در انتقال به سطل زباله' };
  }
}

export async function pinFisherman(id: string) {
  try {
    await db.update(fishermen).set({ manualPinned: true }).where(eq(fishermen.id, id));
    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'خطا در پین کردن' };
  }
}

export async function unpinFisherman(id: string) {
  try {
    await db.update(fishermen).set({ manualPinned: false }).where(eq(fishermen.id, id));
    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'خطا در برداشتن پین' };
  }
}

export async function restoreFisherman(id: string) {
  try {
    await db.update(fishermen).set({ deletedAt: null }).where(eq(fishermen.id, id));
    revalidatePath('/fishermen');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'خطا در بازیابی صیاد' };
  }
}

export async function getTrashedFishermen() {
  return await db
    .select()
    .from(fishermen)
    .where(not(isNull(fishermen.deletedAt)))
    .orderBy(desc(fishermen.deletedAt));
}

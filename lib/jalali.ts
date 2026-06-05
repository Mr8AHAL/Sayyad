import jalaali from 'jalaali-js';

// Convert native Date or string to YYYY/MM/DD
export function toJalali(date: Date | string): string {
  const d = new Date(date);
  const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  
  const month = jm.toString().padStart(2, '0');
  const day = jd.toString().padStart(2, '0');
  
  return `${jy}/${month}/${day}`;
}

export function toGregorian(jalaliStr: string): Date | null {
  try {
    const coords = jalaliStr.split('/');
    if (coords.length !== 3) return null;
    const jy = parseInt(coords[0], 10);
    const jm = parseInt(coords[1], 10);
    const jd = parseInt(coords[2], 10);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    // Create UTC date exactly
    return new Date(Date.UTC(gy, gm - 1, gd));
  } catch (e) {
    return null;
  }
}

export function isValidJalali(str: string): boolean {
  try {
    const parts = str.split('/');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
    
    const validLength = jalaali.jalaaliMonthLength(y, m);
    return m >= 1 && m <= 12 && d >= 1 && d <= validLength;
  } catch (e) {
    return false;
  }
}

export function persianNumbersToEnglish(str: string): string {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i));
  }
  return result;
}

export function daysBetweenDates(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

import { db } from './lib/db';
import { fishermen } from './db/schema';
import { isNull, desc, asc } from 'drizzle-orm';
async function run() {
  try {
    const res = await db.select()
        .from(fishermen)
        .where(isNull(fishermen.deletedAt))
        .orderBy(desc(fishermen.manualPinned), asc(fishermen.fishermanCode));
    console.log('Success!', res.length);
  } catch (e) {
    console.error('Error:', e);
  }
}
run();

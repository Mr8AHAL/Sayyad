import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fishermanFiles, fishermen } from '@/db/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import archiver from 'archiver';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const fishermanId = resolvedParams.id;
  const searchParams = req.nextUrl.searchParams;
  const typeFilter = searchParams.get('type');
  
  let files = await db.query.fishermanFiles.findMany({
    where: eq(fishermanFiles.fishermanId, fishermanId)
  });

  if (typeFilter === 'engine') {
    const engineKeys = ['engine', 'reflector', 'metal_plate'];
    files = files.filter(f => engineKeys.includes(f.fileType));
  } else if (typeFilter === 'main') {
    const mainKeys = ['profile', 'national_card', 'tasht_invoice', 'sanad', 'classification', 'gol', 'captain_card'];
    files = files.filter(f => mainKeys.includes(f.fileType));
  }

  if (files.length === 0) {
    return new NextResponse('<html lang="fa" dir="rtl"><head><meta charset="utf-8"/></head><body style="font-family:Tahoma; text-align:center; padding:50px;">هیچ فایلی برای دانلود وجود ندارد.</body></html>', { 
      status: 404, 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  }

  const fishermanData = await db.query.fishermen.findFirst({
    where: eq(fishermen.id, fishermanId)
  });

  const zipName = `fishermen_${fishermanData?.fishermanCode || fishermanId}_files.zip`;

  // Create an Archiver instance
  const archive = archiver('zip', {
    zlib: { level: 9 } // specify compression level
  });

  // Since Next.js API Routes don't directly handle the stream pipeline easily in standard response, we can use a PassThrough stream
  // Wait, Next.js App Router NextResponses can consume a ReadableStream. 
  // We can convert the Node.js stream into a web ReadableStream.
  
  const { Readable } = require('stream');
  
  // Create a transform stream to pass the archive data to standard Web ReadableStream
  const iterator = archive[Symbol.asyncIterator]();
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    cancel() {
      archive.abort();
    }
  });

  // Append files to the archive
  files.forEach(file => {
    const absolutePath = path.join(process.cwd(), 'public', file.filePath);
    archive.file(absolutePath, { name: file.storedName });
  });

  archive.finalize();

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipName}"`
    }
  });
}

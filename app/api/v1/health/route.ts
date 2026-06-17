import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ db: 'connected' });
  } catch (e) {
    return NextResponse.json({ db: 'error', message: String(e) }, { status: 500 });
  }
}

import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) return NextResponse.json({ message: '블로그를 찾을 수 없습니다.' }, { status: 404 });

    await prisma.blog.update({ where: { slug }, data: { counts: { increment: 1 } } });

    return NextResponse.json(blog);
  } catch (e) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

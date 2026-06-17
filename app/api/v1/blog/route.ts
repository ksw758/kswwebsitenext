import { prisma } from '@/src/lib/prisma';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { BlogCategory } from '@/src/generated/prisma';
import { postToLinkedIn } from '@/src/lib/linkedin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const hashtagsRaw = formData.get('hashtags') as string;
    const file = formData.get('thumbnail') as File | null;

    if (!title || !content || !file) {
      return NextResponse.json({ message: '제목, 내용, 이미지는 필수입니다.' }, { status: 400 });
    }

    if (!Object.values(BlogCategory).includes(category as BlogCategory)) {
      return NextResponse.json({ message: '유효하지 않은 카테고리입니다.' }, { status: 400 });
    }

    const hashtags = hashtagsRaw
      ? hashtagsRaw.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    // Vercel Blob 업로드
    const blob = await put(`blog/thumbnails/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        category: category as BlogCategory,
        hashtags,
        thumbnail: blob.url,
        counts: 0,
      },
    });

    // LinkedIn 동시 포스팅 (실패해도 블로그 저장은 유지)
    const linkedinResult = await postToLinkedIn(title, content, blob.url, hashtags).catch(e => ({
      error: String(e),
    }));

    return NextResponse.json({ blog, linkedin: linkedinResult }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

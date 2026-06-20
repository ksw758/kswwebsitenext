import { prisma } from '@/src/lib/prisma';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { BlogCategory } from '@/src/generated/prisma';
import { postToLinkedIn } from '@/src/lib/linkedin';
import { postToRocketpunch } from '@/src/lib/rocketpunch';

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        blog_id: true,
        slug: true,
        title: true,
        description: true,
        thumbnail: true,
        category: true,
        hashtags: true,
        counts: true,
        create_at: true,
      },
      orderBy: { create_at: 'desc' },
    });
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

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

    const platformsRaw = formData.get('platforms') as string | null;
    const platforms: string[] = platformsRaw ? JSON.parse(platformsRaw) : ['blog', 'linkedin', 'rocketpunch'];

    // Vercel Blob 업로드
    const blob = await put(`blog/thumbnails/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const slug = title
      .toLowerCase()
      .replace(/[^\w\sㄱ-힣]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 100);
    const description = content.replace(/\s+/g, ' ').trim().slice(0, 160);

    const blog = platforms.includes('blog')
      ? await prisma.blog.create({
          data: { slug, title, description, content, category: category as BlogCategory, hashtags, thumbnail: blob.url, counts: 0 },
        })
      : null;

    // 선택된 플랫폼에만 포스팅 (실패해도 블로그 저장은 유지)
    const [linkedinResult, rocketpunchResult] = await Promise.all([
      platforms.includes('linkedin')
        ? postToLinkedIn(title, content, blob.url, hashtags).catch(e => ({ error: String(e) }))
        : { skipped: true },
      platforms.includes('rocketpunch')
        ? postToRocketpunch(title, content, blob.url, hashtags).catch(e => ({ error: String(e) }))
        : { skipped: true },
    ]);

    return NextResponse.json({ blog, linkedin: linkedinResult, rocketpunch: rocketpunchResult }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

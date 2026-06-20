import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { theme } from '@/src/const';

export const metadata: Metadata = {
  title: '블로그 — 상원(SW)에이전츠',
  description: '9년차 풀스택 개발자 김상원의 개발 이야기. 웹/앱 개발, 바이브코딩, 외주 경험을 공유합니다.',
  openGraph: {
    title: '블로그 — 상원(SW)에이전츠',
    description: '9년차 풀스택 개발자 김상원의 개발 이야기.',
    url: 'https://kswwebsitenext.vercel.app/blog',
    type: 'website',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  FREE: '자유',
  DEVELOP: '개발',
  GAME: '게임',
  SPORT: '스포츠',
  SHOW: '방송/공연',
};

export default async function BlogPage() {
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
    where: { slug: { not: null } },
    orderBy: { create_at: 'desc' },
  });

  return (
    <main style={{ minHeight: '100vh', background: theme.color.sepia }}>
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <p style={{ fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold, marginBottom: 16 }}>
        Blog
      </p>
      <h1 style={{ fontFamily: theme.font.serif, fontSize: 32, fontWeight: 700, color: theme.color.parchment, marginBottom: 56 }}>
        개발 이야기
      </h1>

      {blogs.length === 0 ? (
        <p style={{ fontFamily: theme.font.serif, color: `${theme.color.parchment}66`, fontSize: 14 }}>
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 40 }}>
          {blogs.map(blog => (
            <Link
              key={blog.blog_id}
              href={`/blog/${blog.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 280px',
                  gap: 32,
                  borderBottom: `1px solid ${theme.color.gold}22`,
                  paddingBottom: 40,
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{
                      fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '2px',
                      textTransform: 'uppercase', color: theme.color.gold,
                    }}>
                      {CATEGORY_LABELS[blog.category] ?? blog.category}
                    </span>
                    <span style={{ color: `${theme.color.parchment}44`, fontSize: 10 }}>·</span>
                    <span style={{ fontFamily: theme.font.serif, fontSize: 11, color: `${theme.color.parchment}55` }}>
                      {new Date(blog.create_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 style={{
                    fontFamily: theme.font.serif, fontSize: 20, fontWeight: 600,
                    color: theme.color.parchment, marginBottom: 12, lineHeight: 1.5,
                  }}>
                    {blog.title}
                  </h2>
                  {blog.description && (
                    <p style={{
                      fontFamily: theme.font.serif, fontSize: 13, color: `${theme.color.parchment}88`,
                      lineHeight: 1.8, marginBottom: 16,
                    }}>
                      {blog.description.slice(0, 120)}{blog.description.length > 120 ? '...' : ''}
                    </p>
                  )}
                  {blog.hashtags.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {blog.hashtags.slice(0, 4).map(tag => (
                        <span key={tag} style={{
                          fontFamily: theme.font.serif, fontSize: 11,
                          color: theme.color.gold, opacity: 0.7,
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{
                  borderRadius: 4, overflow: 'hidden',
                  aspectRatio: '16/9', background: `${theme.color.parchment}11`,
                }}>
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
    </main>
  );
}

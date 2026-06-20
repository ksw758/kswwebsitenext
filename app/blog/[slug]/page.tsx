import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { theme } from '@/src/const';

const BASE_URL = 'https://kswwebsitenext.vercel.app';

const CATEGORY_LABELS: Record<string, string> = {
  FREE: '자유',
  DEVELOP: '개발',
  GAME: '게임',
  SPORT: '스포츠',
  SHOW: '방송/공연',
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) return {};

  return {
    title: `${blog.title} — 상원(SW)에이전츠`,
    description: blog.description ?? undefined,
    keywords: blog.hashtags,
    openGraph: {
      title: blog.title,
      description: blog.description ?? undefined,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: blog.create_at.toISOString(),
      modifiedTime: blog.update_at.toISOString(),
      authors: ['김상원'],
      images: [{ url: blog.thumbnail, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description ?? undefined,
      images: [blog.thumbnail],
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) notFound();

  return (
    <main style={{ minHeight: '100vh', background: theme.color.sepia }}>
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px' }}>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.description,
            image: blog.thumbnail,
            datePublished: blog.create_at.toISOString(),
            dateModified: blog.update_at.toISOString(),
            author: { '@type': 'Person', name: '김상원', url: BASE_URL },
            publisher: { '@type': 'Organization', name: '상원(SW)에이전츠', url: BASE_URL },
            url: `${BASE_URL}/blog/${slug}`,
            keywords: blog.hashtags.join(', '),
          }),
        }}
      />

      {/* 카테고리 + 날짜 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: theme.color.gold }}>
          {CATEGORY_LABELS[blog.category] ?? blog.category}
        </span>
        <span style={{ color: `${theme.color.parchment}44` }}>·</span>
        <span style={{ fontFamily: theme.font.serif, fontSize: 11, color: `${theme.color.parchment}55` }}>
          {new Date(blog.create_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span style={{ color: `${theme.color.parchment}44` }}>·</span>
        <span style={{ fontFamily: theme.font.serif, fontSize: 11, color: `${theme.color.parchment}44` }}>
          조회 {blog.counts.toLocaleString()}
        </span>
      </div>

      {/* 제목 */}
      <h1 style={{ fontFamily: theme.font.serif, fontSize: 32, fontWeight: 700, color: theme.color.parchment, lineHeight: 1.5, marginBottom: 32 }}>
        {blog.title}
      </h1>

      {/* 썸네일 */}
      <div style={{ borderRadius: 4, overflow: 'hidden', marginBottom: 48, maxHeight: 460 }}>
        <img src={blog.thumbnail} alt={blog.title} style={{ width: '100%', objectFit: 'cover' }} />
      </div>

      {/* 본문 */}
      <div style={{
        fontFamily: theme.font.serif, fontSize: 15, color: `${theme.color.parchment}CC`,
        lineHeight: 2, whiteSpace: 'pre-wrap', borderTop: `1px solid ${theme.color.gold}22`, paddingTop: 40,
      }}>
        {blog.content}
      </div>

      {/* 해시태그 */}
      {blog.hashtags.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 48, paddingTop: 32, borderTop: `1px solid ${theme.color.gold}22` }}>
          {blog.hashtags.map(tag => (
            <span key={tag} style={{ fontFamily: theme.font.serif, fontSize: 12, color: theme.color.gold, opacity: 0.8 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
    </main>
  );
}

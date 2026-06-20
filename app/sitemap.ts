import { MetadataRoute } from 'next';
import { prisma } from '@/src/lib/prisma';

const BASE_URL = 'https://kswwebsitenext.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await prisma.blog.findMany({
    where: { slug: { not: null } },
    select: { slug: true, update_at: true },
    orderBy: { create_at: 'desc' },
  });

  const blogEntries: MetadataRoute.Sitemap = blogs.map(b => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.update_at,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/my-resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/coding`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ...blogEntries,
  ];
}

import { notFound } from 'next/navigation';
import BlogWriteForm from '@/src/components/blog/BlogWriteForm';
import { theme } from '@/src/const';
import { isBlogWriteEnabled } from '@/src/lib/guard';

export default function BlogWritePage() {
  if (!isBlogWriteEnabled()) notFound();

  return (
    <main style={{ minHeight: '100vh', background: theme.color.sepia }}>
      <BlogWriteForm />
    </main>
  );
}

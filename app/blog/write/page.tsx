import { notFound } from 'next/navigation';
import BlogWriteForm from '@/src/components/blog/BlogWriteForm';
import { theme } from '@/src/const';

export default function BlogWritePage() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  return (
    <main style={{ minHeight: '100vh', background: theme.color.sepia }}>
      <BlogWriteForm />
    </main>
  );
}

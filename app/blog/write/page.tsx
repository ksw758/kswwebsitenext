import BlogWriteForm from '@/src/components/blog/BlogWriteForm';
import { theme } from '@/src/const';

export default function BlogWritePage() {
  return (
    <main style={{ minHeight: '100vh', background: theme.color.sepia }}>
      <BlogWriteForm />
    </main>
  );
}

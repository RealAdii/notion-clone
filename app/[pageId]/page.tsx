'use client';

import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { PageContent } from '@/components/PageContent';

export default function PageView() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;

  const handlePageCreated = (newPageId: string) => {
    router.push(`/${newPageId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onPageCreated={handlePageCreated} />
      <PageContent pageId={pageId} />
    </div>
  );
}

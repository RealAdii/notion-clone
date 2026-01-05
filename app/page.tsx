'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { SetupScreen } from '@/components/SetupScreen';
import { usePages } from '@/hooks/usePages';
import { FileText } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { configured, loading } = usePages();

  const handlePageCreated = (pageId: string) => {
    router.push(`/${pageId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex h-screen">
        <Sidebar onPageCreated={handlePageCreated} />
        <SetupScreen />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar onPageCreated={handlePageCreated} />
      <main className="flex-1 flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="text-center text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a page or create a new one</p>
          <p className="text-sm mt-2">Use the sidebar to get started</p>
        </div>
      </main>
    </div>
  );
}

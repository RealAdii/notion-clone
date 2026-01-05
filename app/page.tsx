'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { SetupScreen } from '@/components/SetupScreen';
import { usePages } from '@/hooks/usePages';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { configured, loading, createPage } = usePages();

  const handlePageCreated = (pageId: string) => {
    router.push(`/${pageId}`);
  };

  const handleQuickCreate = async () => {
    const page = await createPage(null);
    if (page) {
      router.push(`/${page.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-[#191919]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
        </div>
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
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles size={32} className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            Welcome to Notion Clone
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Select a page from the sidebar or create a new one to get started
          </p>
          <button
            onClick={handleQuickCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Create a page
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}

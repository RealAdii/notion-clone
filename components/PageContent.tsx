'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';
import { Editor } from './Editor';
import { usePages } from '@/hooks/usePages';

interface PageContentProps {
  pageId: string;
}

export function PageContent({ pageId }: PageContentProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { updatePage } = usePages();

  const fetchPage = useCallback(async () => {
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (pageError) {
      console.error('Error fetching page:', pageError);
      setLoading(false);
      return;
    }

    setPage(pageData);

    const { data: blocksData } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('order', { ascending: true });

    if (blocksData && blocksData.length > 0) {
      const html = blocksData.map((b) => b.content.html || '').join('');
      setContent(html);
    } else {
      setContent('');
    }

    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleTitleChange = async (newTitle: string) => {
    if (!page) return;
    setPage({ ...page, title: newTitle });
    await updatePage(pageId, { title: newTitle });
  };

  const handleContentChange = useCallback(
    async (html: string) => {
      setContent(html);
      setSaving(true);

      // Save as a single block for simplicity
      const { data: existingBlocks } = await supabase
        .from('blocks')
        .select('id')
        .eq('page_id', pageId);

      if (existingBlocks && existingBlocks.length > 0) {
        await supabase
          .from('blocks')
          .update({ content: { html }, type: 'paragraph' })
          .eq('id', existingBlocks[0].id);
      } else {
        await supabase.from('blocks').insert({
          page_id: pageId,
          content: { html },
          type: 'paragraph',
          order: 0,
        });
      }

      setSaving(false);
    },
    [pageId]
  );

  // Debounced save
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedContent !== content) {
        setDebouncedContent(content);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [content, debouncedContent]);

  useEffect(() => {
    if (debouncedContent && debouncedContent !== content) {
      handleContentChange(debouncedContent);
    }
  }, [debouncedContent]);

  const handleIconChange = async () => {
    if (!page) return;
    const emojis = ['📄', '📝', '📚', '💡', '🎯', '🚀', '⭐', '🔥', '💻', '📊'];
    const currentIndex = emojis.indexOf(page.icon);
    const nextIndex = (currentIndex + 1) % emojis.length;
    const newIcon = emojis[nextIndex];
    setPage({ ...page, icon: newIcon });
    await updatePage(pageId, { icon: newIcon });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Page not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#191919]">
      <div className="max-w-3xl mx-auto px-16 py-12">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={handleIconChange}
            className="text-5xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 transition-colors"
            title="Click to change icon"
          >
            {page.icon}
          </button>
          {saving && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
        </div>

        <input
          type="text"
          value={page.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-4xl font-bold text-gray-900 dark:text-gray-100 border-none outline-none mb-8 bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
          placeholder="Untitled"
        />

        <Editor
          content={content}
          onChange={setContent}
          placeholder="Press '/' for commands, or just start typing..."
        />
      </div>
    </div>
  );
}

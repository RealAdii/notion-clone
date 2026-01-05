'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Page, PageTreeItem } from '@/lib/types';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  const fetchPages = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setConfigured(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pages:', error);
      setLoading(false);
      return;
    }

    setPages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPages();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        () => fetchPages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPages]);

  const createPage = async (parentId: string | null = null): Promise<Page | null> => {
    const { data, error } = await supabase
      .from('pages')
      .insert({ parent_id: parentId })
      .select()
      .single();

    if (error) {
      console.error('Error creating page:', error);
      return null;
    }

    return data;
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    const { error } = await supabase
      .from('pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating page:', error);
    }
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);

    if (error) {
      console.error('Error deleting page:', error);
    }
  };

  const buildPageTree = (pages: Page[]): PageTreeItem[] => {
    const pageMap = new Map<string, PageTreeItem>();
    const rootPages: PageTreeItem[] = [];

    pages.forEach((page) => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    pages.forEach((page) => {
      const pageItem = pageMap.get(page.id)!;
      if (page.parent_id && pageMap.has(page.parent_id)) {
        pageMap.get(page.parent_id)!.children.push(pageItem);
      } else {
        rootPages.push(pageItem);
      }
    });

    return rootPages;
  };

  return {
    pages,
    pageTree: buildPageTree(pages),
    loading,
    configured,
    createPage,
    updatePage,
    deletePage,
    refetch: fetchPages,
  };
}

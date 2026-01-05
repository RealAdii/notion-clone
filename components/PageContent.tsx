'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';
import { Editor } from './Editor';
import { usePages } from '@/hooks/usePages';
import { ImageIcon, SmilePlus, MessageSquare, Clock, MoreHorizontal } from 'lucide-react';

const COVER_GRADIENTS = [
  'from-rose-400 to-orange-300',
  'from-violet-400 to-purple-300',
  'from-blue-400 to-cyan-300',
  'from-green-400 to-emerald-300',
  'from-yellow-400 to-orange-300',
  'from-pink-400 to-rose-300',
  'from-indigo-400 to-blue-300',
  'from-teal-400 to-green-300',
];

const EMOJIS = [
  // Smileys
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋',
  '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢',
  '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔',
  '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤',
  // People
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
  '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾',
  // Nature
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
  '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿',
  '🍀', '🍁', '🍂', '🍃', '🍄', '🌍', '🌎', '🌏', '🌕', '🌙', '⭐', '🌟', '✨', '⚡', '🔥', '🌈',
  // Food
  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑',
  '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥗', '🍜', '🍝', '🍣', '🍱', '🍩', '🍪', '🎂', '🍰',
  '☕', '🍵', '🧃', '🥤', '🍺', '🍷', '🥂', '🍾',
  // Activities
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🥅', '⛳', '🏹',
  '🎣', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🏋️', '🤸', '🏄', '🏊',
  '🎮', '🎲', '🎯', '🎳', '🎪', '🎨', '🎭', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕',
  // Travel
  '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲',
  '✈️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '🚢', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢',
  // Objects
  '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💽', '💾', '💿', '📀', '🎥', '📷', '📹', '📼', '🔍',
  '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰',
  '📑', '🔖', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️', '📧', '📨', '📩', '📤',
  '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '📁',
  '📂', '🗂️', '📅', '📆', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️',
  '🔒', '🔓', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🛡️', '🔧', '🔩', '⚙️',
  // Symbols
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
  '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫',
  '✅', '❌', '❓', '❗', '💯', '🔱', '⚜️', '🔰', '♻️', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️',
  // Flags
  '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️',
];

interface PageContentProps {
  pageId: string;
}

export function PageContent({ pageId }: PageContentProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [coverGradient, setCoverGradient] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { updatePage } = usePages();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const initialContentRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Randomly assign a cover gradient for demo purposes
    const savedGradient = localStorage.getItem(`cover-${pageId}`);
    if (savedGradient) {
      setCoverGradient(savedGradient);
      setShowCover(true);
    }

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
    // Reset refs when page changes
    initialContentRef.current = null;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    fetchPage();
  }, [fetchPage]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [page?.title]);

  const handleTitleChange = async (newTitle: string) => {
    if (!page) return;
    setPage({ ...page, title: newTitle });
    await updatePage(pageId, { title: newTitle });
  };

  const saveContent = useCallback(
    async (html: string) => {
      if (!html && html !== '') return;

      setSaving(true);

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

  const handleContentChange = useCallback(
    (html: string) => {
      setContent(html);

      // Don't save if this is the initial load
      if (initialContentRef.current === null) {
        initialContentRef.current = html;
        return;
      }

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save by 500ms
      saveTimeoutRef.current = setTimeout(() => {
        saveContent(html);
      }, 500);
    },
    [saveContent]
  );

  // Mark content as initialized after fetch
  useEffect(() => {
    if (!loading && initialContentRef.current === null) {
      initialContentRef.current = content;
    }
  }, [loading, content]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleIconChange = async (emoji: string) => {
    if (!page) return;
    setPage({ ...page, icon: emoji });
    setShowEmojiPicker(false);
    await updatePage(pageId, { icon: emoji });
  };

  const handleAddCover = () => {
    const randomGradient = COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)];
    setCoverGradient(randomGradient);
    setShowCover(true);
    localStorage.setItem(`cover-${pageId}`, randomGradient);
  };

  const handleRemoveCover = () => {
    setShowCover(false);
    setCoverGradient('');
    localStorage.removeItem(`cover-${pageId}`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="space-y-4 w-full max-w-2xl px-16">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-1/3" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-2/3" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-neutral-400" />
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">Page not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#191919]">
      {/* Cover Image */}
      {showCover && (
        <div className={`h-[30vh] min-h-[200px] bg-gradient-to-r ${coverGradient} relative group`}>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleRemoveCover}
              className="px-3 py-1.5 bg-white/90 dark:bg-neutral-800/90 text-sm text-neutral-600 dark:text-neutral-300 rounded-md hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Remove cover
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-3xl mx-auto px-16 ${showCover ? '-mt-16' : 'pt-20'}`}>
        {/* Icon and controls */}
        <div className="relative mb-4">
          {/* Icon */}
          <div className="relative inline-block group">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`text-6xl hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg p-2 transition-colors ${
                showCover ? 'bg-white dark:bg-[#191919] shadow-lg' : ''
              }`}
            >
              {page.icon}
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 w-[320px] max-h-[300px] overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJIS.map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        onClick={() => handleIconChange(emoji)}
                        className="w-8 h-8 text-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add cover / Add icon buttons */}
          {!showCover && (
            <div className="flex items-center gap-2 mt-3 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                onClick={handleAddCover}
                className="flex items-center gap-1.5 px-2 py-1 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
              >
                <ImageIcon size={14} />
                Add cover
              </button>
            </div>
          )}

          {/* Saving indicator */}
          {saving && (
            <div className="absolute top-2 right-0 flex items-center gap-1.5 text-xs text-neutral-400">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              Saving...
            </div>
          )}
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          value={page.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-4xl font-bold text-neutral-900 dark:text-neutral-100 border-none outline-none bg-transparent placeholder-neutral-300 dark:placeholder-neutral-600 resize-none overflow-hidden leading-tight"
          placeholder="Untitled"
          rows={1}
        />

        {/* Page meta */}
        <div className="flex items-center gap-4 mt-2 mb-8 text-sm text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>
              {new Date(page.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Editor */}
        <div className="pb-32">
          <Editor
            content={content}
            onChange={handleContentChange}
            placeholder="Press '/' for commands, or just start typing..."
          />
        </div>
      </div>
    </div>
  );
}

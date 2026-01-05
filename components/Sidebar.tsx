'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  Plus,
  Trash2,
  MoreHorizontal,
  Moon,
  Sun,
} from 'lucide-react';
import { PageTreeItem } from '@/lib/types';
import { usePages } from '@/hooks/usePages';
import { useTheme } from '@/hooks/useTheme';

interface PageItemProps {
  page: PageTreeItem;
  level: number;
  onCreateSubpage: (parentId: string) => void;
  onDelete: (id: string) => void;
}

function PageItem({ page, level, onCreateSubpage, onDelete }: PageItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === `/${page.id}`;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            page.children.length === 0 ? 'invisible' : ''
          }`}
        >
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>

        <Link href={`/${page.id}`} className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-sm">{page.icon}</span>
          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{page.title}</span>
        </Link>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubpage(page.id);
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus size={14} className="text-gray-400" />
          </button>
        </div>

        {showMenu && (
          <div className="absolute right-2 mt-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {isExpanded && page.children.length > 0 && (
        <div>
          {page.children.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              level={level + 1}
              onCreateSubpage={onCreateSubpage}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  onPageCreated?: (pageId: string) => void;
}

export function Sidebar({ onPageCreated }: SidebarProps) {
  const { pageTree, loading, configured, createPage, deletePage } = usePages();
  const { theme, toggleTheme } = useTheme();

  const handleCreatePage = async (parentId: string | null = null) => {
    const newPage = await createPage(parentId);
    if (newPage && onPageCreated) {
      onPageCreated(newPage.id);
    }
  };

  return (
    <aside className="w-60 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">Notion Clone</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-gray-400" />
            ) : (
              <Moon size={16} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => handleCreatePage(null)}
            disabled={!configured}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="New page"
          >
            <Plus size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {!configured ? (
          <div className="px-4 py-2 text-sm text-gray-400">
            Set up Supabase to get started
          </div>
        ) : loading ? (
          <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
        ) : pageTree.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400">No pages yet</div>
        ) : (
          pageTree.map((page) => (
            <PageItem
              key={page.id}
              page={page}
              level={0}
              onCreateSubpage={handleCreatePage}
              onDelete={deletePage}
            />
          ))
        )}
      </div>
    </aside>
  );
}

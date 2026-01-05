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
  Search,
  Settings,
  FileText,
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
        className={`group flex items-center gap-1 py-1 pr-2 rounded-md cursor-pointer transition-colors duration-100
          ${isActive
            ? 'bg-neutral-200/80 dark:bg-neutral-700/50'
            : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-700/30'
          }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className={`p-0.5 rounded hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50 transition-colors ${
            page.children.length === 0 ? 'invisible' : ''
          }`}
        >
          <ChevronRight
            size={12}
            className={`text-neutral-400 dark:text-neutral-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>

        <Link href={`/${page.id}`} className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{page.icon}</span>
          <span className={`text-sm truncate transition-colors ${
            isActive
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}>
            {page.title}
          </span>
        </Link>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-neutral-300/70 dark:hover:bg-neutral-600/50 transition-colors"
          >
            <MoreHorizontal size={14} className="text-neutral-400" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCreateSubpage(page.id);
            }}
            className="p-1 rounded hover:bg-neutral-300/70 dark:hover:bg-neutral-600/50 transition-colors"
          >
            <Plus size={14} className="text-neutral-400" />
          </button>
        </div>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute left-full ml-1 top-0 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 z-50 min-w-[150px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(page.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {isExpanded && page.children.length > 0 && (
        <div className="animate-in slide-in-from-top-1 duration-200">
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
    <aside className="w-[240px] h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col border-r border-neutral-200/50 dark:border-neutral-800">
      {/* Workspace header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-300 dark:to-neutral-500 rounded text-[10px] flex items-center justify-center text-white dark:text-neutral-900 font-semibold">
            N
          </div>
          <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200">Notion Clone</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={14} className="text-neutral-500" />
            ) : (
              <Moon size={14} className="text-neutral-500" />
            )}
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-2 pb-2 space-y-0.5">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 rounded-md transition-colors">
          <Search size={14} />
          <span>Search</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 rounded-md transition-colors">
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-neutral-200 dark:border-neutral-800" />

      {/* Pages section */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Pages</span>
          <button
            onClick={() => handleCreatePage(null)}
            disabled={!configured}
            className="p-1 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30"
            title="Add page"
          >
            <Plus size={14} className="text-neutral-400" />
          </button>
        </div>

        {!configured ? (
          <div className="px-2 py-8 text-center">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText size={20} className="text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-400">Set up Supabase to get started</p>
          </div>
        ) : loading ? (
          <div className="px-2 py-4">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 bg-neutral-200/50 dark:bg-neutral-800/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : pageTree.length === 0 ? (
          <div className="px-2 py-8 text-center">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText size={20} className="text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-400 mb-2">No pages yet</p>
            <button
              onClick={() => handleCreatePage(null)}
              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Create your first page
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {pageTree.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                level={0}
                onCreateSubpage={handleCreatePage}
                onDelete={deletePage}
              />
            ))}
          </div>
        )}
      </div>

      {/* New page button at bottom */}
      <div className="p-2 border-t border-neutral-200/50 dark:border-neutral-800">
        <button
          onClick={() => handleCreatePage(null)}
          disabled={!configured}
          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 rounded-md transition-colors disabled:opacity-30"
        >
          <Plus size={14} />
          <span>New page</span>
        </button>
      </div>
    </aside>
  );
}

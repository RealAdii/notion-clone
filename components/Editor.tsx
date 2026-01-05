'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Highlighter,
  Link as LinkIcon,
  Palette,
  ChevronDown,
} from 'lucide-react';

// Slash Menu
interface SlashMenuProps {
  editor: ReturnType<typeof useEditor>;
  position: { top: number; left: number } | null;
  onClose: () => void;
}

const menuItems = [
  { label: 'Text', description: 'Plain text', icon: Type, command: 'paragraph' },
  { label: 'Heading 1', description: 'Large heading', icon: Heading1, command: 'heading1' },
  { label: 'Heading 2', description: 'Medium heading', icon: Heading2, command: 'heading2' },
  { label: 'Heading 3', description: 'Small heading', icon: Heading3, command: 'heading3' },
  { label: 'Bullet List', description: 'Unordered list', icon: List, command: 'bulletList' },
  { label: 'Numbered List', description: 'Ordered list', icon: ListOrdered, command: 'orderedList' },
  { label: 'Code Block', description: 'Code snippet', icon: Code, command: 'codeBlock' },
  { label: 'Quote', description: 'Block quote', icon: Quote, command: 'blockquote' },
];

const COLORS = [
  { name: 'Default', color: null },
  { name: 'Gray', color: '#9ca3af' },
  { name: 'Brown', color: '#a78bfa' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Red', color: '#ef4444' },
];

const HIGHLIGHTS = [
  { name: 'None', color: null },
  { name: 'Gray', color: '#e5e7eb' },
  { name: 'Brown', color: '#fef3c7' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Blue', color: '#bfdbfe' },
  { name: 'Purple', color: '#e9d5ff' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Red', color: '#fecaca' },
];

function SlashMenu({ editor, position, onClose }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((i) => (i + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        executeCommand(menuItems[selectedIndex].command);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedIndex, onClose, position]);

  const executeCommand = (command: string) => {
    if (!editor) return;

    editor.chain().focus().deleteRange({
      from: editor.state.selection.from - 1,
      to: editor.state.selection.from,
    }).run();

    switch (command) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
    }

    onClose();
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [position]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-72 z-[9999] animate-fade-in"
      style={{
        top: Math.min(position.top, window.innerHeight - 400),
        left: Math.min(position.left, window.innerWidth - 300),
      }}
    >
      <div className="px-3 py-1.5 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Basic blocks</div>
      {menuItems.map((item, index) => (
        <button
          key={item.command}
          onClick={() => executeCommand(item.command)}
          onMouseEnter={() => setSelectedIndex(index)}
          className={`flex items-center gap-3 w-full px-3 py-2 text-left transition-colors ${
            index === selectedIndex
              ? 'bg-neutral-100 dark:bg-neutral-700/50'
              : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/30'
          }`}
        >
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
            index === selectedIndex
              ? 'bg-white dark:bg-neutral-600 shadow-sm'
              : 'bg-neutral-100 dark:bg-neutral-700'
          }`}>
            <item.icon size={20} className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{item.label}</div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}

function ToolbarButton({ onClick, isActive, children, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? 'bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-white'
          : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
      }`}
    >
      {children}
    </button>
  );
}

// Color Picker Dropdown
interface ColorPickerProps {
  editor: ReturnType<typeof useEditor>;
  type: 'text' | 'highlight';
  onColorSelect: () => void;
}

function ColorPicker({ editor, type, onColorSelect }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = type === 'text' ? COLORS : HIGHLIGHTS;

  if (!editor) return null;

  const handleColorSelect = (color: string | null) => {
    if (type === 'text') {
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
    } else {
      if (color) {
        editor.chain().focus().toggleHighlight({ color }).run();
      } else {
        editor.chain().focus().unsetHighlight().run();
      }
    }
    setIsOpen(false);
    onColorSelect();
  };

  return (
    <div className="relative">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-0.5 p-1.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        title={type === 'text' ? 'Text color' : 'Highlight'}
      >
        {type === 'text' ? <Palette size={16} /> : <Highlighter size={16} />}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-1 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl z-50 grid grid-cols-5 gap-1">
            {colors.map((c) => (
              <button
                key={c.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleColorSelect(c.color);
                }}
                className="w-6 h-6 rounded-md border border-neutral-200 dark:border-neutral-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.color || (type === 'text' ? '#374151' : 'transparent') }}
                title={c.name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Link Input
interface LinkInputProps {
  editor: ReturnType<typeof useEditor>;
  onClose: () => void;
}

function LinkInput({ editor, onClose }: LinkInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
        className="w-40 px-2 py-1 text-sm bg-transparent border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:border-blue-500"
        autoFocus
      />
      <button
        type="submit"
        className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Add
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-2 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        Cancel
      </button>
    </form>
  );
}

// Floating Toolbar Component
interface FloatingToolbarProps {
  editor: ReturnType<typeof useEditor>;
  position: { top: number; left: number } | null;
}

function FloatingToolbar({ editor, position }: FloatingToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  if (!editor || !position) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed flex items-center gap-0.5 px-1 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl z-[9999] animate-fade-in"
      style={{
        top: Math.max(10, position.top - 45),
        left: Math.max(10, Math.min(position.left, window.innerWidth - 350)),
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {showLinkInput ? (
        <LinkInput editor={editor} onClose={() => setShowLinkInput(false)} />
      ) : (
        <>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Cmd+B)"
          >
            <Bold size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Cmd+I)"
          >
            <Italic size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Cmd+U)"
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline code"
          >
            <CodeIcon size={16} />
          </ToolbarButton>

          <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />

          <ColorPicker editor={editor} type="text" onColorSelect={() => {}} />
          <ColorPicker editor={editor} type="highlight" onColorSelect={() => {}} />

          <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />

          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(true);
              }
            }}
            isActive={editor.isActive('link')}
            title="Add link"
          >
            <LinkIcon size={16} />
          </ToolbarButton>
        </>
      )}
    </div>
  );
}

// Main Editor Component
interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder = "Press '/' for commands..." }: EditorProps) {
  const [slashMenuPosition, setSlashMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer hover:text-blue-600',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      if (hasSelection) {
        const coords = editor.view.coordsAtPos(from);
        setToolbarPosition({
          top: coords.top,
          left: coords.left,
        });
      } else {
        setToolbarPosition(null);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !slashMenuPosition) {
        setTimeout(() => {
          const { from } = editor.state.selection;
          const coords = editor.view.coordsAtPos(from);
          setSlashMenuPosition({
            top: coords.bottom + 5,
            left: coords.left,
          });
        }, 0);
      }
    };

    const handleClick = () => {
      if (slashMenuPosition) {
        setSlashMenuPosition(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [editor, slashMenuPosition]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't hide if clicking on the toolbar itself
      if (target.closest('[data-floating-toolbar]')) return;
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  return (
    <div className="relative">
      {/* Floating Toolbar - appears on text selection */}
      <FloatingToolbar editor={editor} position={toolbarPosition} />

      <EditorContent editor={editor} />

      <SlashMenu
        editor={editor}
        position={slashMenuPosition}
        onClose={() => setSlashMenuPosition(null)}
      />
    </div>
  );
}

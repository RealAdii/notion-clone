'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback, useState, useRef } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
} from 'lucide-react';

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

    // Delete the slash character
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

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 w-72 z-50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-1 text-xs text-gray-400 uppercase">Basic blocks</div>
      {menuItems.map((item, index) => (
        <button
          key={item.command}
          onClick={() => executeCommand(item.command)}
          className={`flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
            index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <item.icon size={20} className="text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</div>
            <div className="text-xs text-gray-400">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder = "Press '/' for commands..." }: EditorProps) {
  const [slashMenuPosition, setSlashMenuPosition] = useState<{ top: number; left: number } | null>(null);

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

    const handleClick = (e: MouseEvent) => {
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

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      <SlashMenu
        editor={editor}
        position={slashMenuPosition}
        onClose={() => setSlashMenuPosition(null)}
      />
    </div>
  );
}

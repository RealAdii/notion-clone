# Notion Clone

A minimal, fast Notion-like editor built with Next.js, Tiptap, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## Features

- **Block-based Editor** - Rich text editing powered by Tiptap (ProseMirror)
- **Slash Commands** - Type `/` to insert headings, lists, code blocks, quotes
- **Floating Toolbar** - Select text to format with bold, italic, colors, highlights, links
- **Nested Pages** - Organize pages in a tree structure
- **Auto-save** - Changes sync automatically to Supabase
- **Dark Mode** - Toggle between light and dark themes
- **Cover Images** - Add gradient covers to pages
- **Page Icons** - Customize pages with emoji icons

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Tiptap (ProseMirror-based)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/notion-clone.git
cd notion-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following:

```sql
-- Pages table
create table pages (
  id uuid default gen_random_uuid() primary key,
  title text not null default 'Untitled',
  parent_id uuid references pages(id) on delete cascade,
  icon text default '📄',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Blocks table
create table blocks (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  type text not null default 'paragraph',
  content jsonb not null default '{}',
  "order" integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Enable realtime
alter publication supabase_realtime add table pages;
alter publication supabase_realtime add table blocks;

-- Create indexes
create index blocks_page_id_idx on blocks(page_id);
create index pages_parent_id_idx on pages(parent_id);
```

3. Go to **Project Settings > API** and copy your credentials

### 4. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Editor Commands

| Action | Shortcut |
|--------|----------|
| Slash menu | `/` |
| Bold | `Cmd/Ctrl + B` |
| Italic | `Cmd/Ctrl + I` |
| Underline | `Cmd/Ctrl + U` |

### Block Types

- **Text** - Plain paragraph
- **Heading 1/2/3** - Section headings
- **Bullet List** - Unordered list
- **Numbered List** - Ordered list
- **Code Block** - Code snippets
- **Quote** - Block quotes

### Formatting Options

Select text to reveal the floating toolbar:
- Bold, Italic, Underline, Strikethrough
- Inline code
- Text colors (10 colors)
- Highlight colors (10 colors)
- Links

## Project Structure

```
notion-clone/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── [pageId]/
│       └── page.tsx        # Page view
├── components/
│   ├── Editor.tsx          # Tiptap editor + toolbars
│   ├── Sidebar.tsx         # Navigation tree
│   ├── PageContent.tsx     # Page view component
│   └── SetupScreen.tsx     # Supabase setup guide
├── hooks/
│   ├── usePages.ts         # Page CRUD operations
│   └── useTheme.ts         # Dark mode hook
└── lib/
    ├── supabase.ts         # Supabase client
    └── types.ts            # TypeScript types
```

## Deploy

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
npm start
```

## License

MIT

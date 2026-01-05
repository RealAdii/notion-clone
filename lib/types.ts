export interface Page {
  id: string;
  title: string;
  parent_id: string | null;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: BlockType;
  content: BlockContent;
  order: number;
  created_at: string;
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'blockquote';

export interface BlockContent {
  text?: string;
  html?: string;
}

export interface PageTreeItem extends Page {
  children: PageTreeItem[];
}

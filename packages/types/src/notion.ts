export interface NotionUser {
  object: 'user';
  id: string;
}

export interface TextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface RichTextItem {
  type: 'text';
  text: {
    content: string;
    link: string | null;
  };
  annotations: TextAnnotations;
  plain_text: string;
  href: string | null;
}

export interface RichTextProperty {
  id: string;
  type: 'rich_text';
  rich_text: RichTextItem[];
}

export interface NumberProperty {
  id: string;
  type: 'number';
  number: number;
}

export interface TitleProperty {
  id: string;
  type: 'title';
  title: RichTextItem[];
}

export interface DatabaseParent {
  type: 'database_id';
  database_id: string;
}

export interface FaqProperties {
  content: RichTextProperty;
  id: NumberProperty;
  title: TitleProperty;
}

export interface MemberProperties {
  githubId: RichTextProperty;
  role: RichTextProperty;
  id: NumberProperty;
  name: TitleProperty;
}

interface BaseNotionPage<T> {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: null;
  icon: null;
  parent: DatabaseParent;
  archived: boolean;
  in_trash: boolean;
  properties: T;
  url: string;
  public_url: string | null;
}

export interface FaqPageData extends BaseNotionPage<FaqProperties> {}

export interface MemberPageData extends BaseNotionPage<MemberProperties> {}

interface BaseNotionResponse<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
  type: 'page_or_database';
  page_or_database: Record<string, unknown>;
  developer_survey: string;
  request_id: string;
}

export interface FaqListResponse extends BaseNotionResponse<FaqPageData> {}

export interface MemberListResponse extends BaseNotionResponse<MemberPageData> {}

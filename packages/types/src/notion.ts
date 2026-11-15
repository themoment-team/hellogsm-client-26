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

export type FaqPageData = BaseNotionPage<FaqProperties>;

export type MemberPageData = BaseNotionPage<MemberProperties>;

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

export type FaqListResponse = BaseNotionResponse<FaqPageData>;

/** FAQ 화면에 넘기는 값. Notion 페이지 객체 대신 화면에서 쓰는 텍스트만 담습니다. */
export interface FaqItem {
  /** 제목이 비어 있는 FAQ는 목록에서 제외되므로 undefined를 그대로 유지합니다. */
  title: string | undefined;
  content: string;
}

export type MemberListResponse = BaseNotionResponse<MemberPageData>;

import type { Metadata } from 'next';

import { FaqItem, FaqListResponse } from '@repo/types';

import { FaqPage } from '@/pageContainer';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
};

const getFaqData = async (): Promise<FaqItem[]> => {
  const response = await fetch(
    new URL(
      `https://api.notion.com/v1/databases/${process.env.NEXT_PUBLIC_NOTION_FAQ_DATABASE_ID}/query`,
    ),
    {
      method: 'POST',
      headers: {
        // 서버 컴포넌트에서만 읽는 서버 전용 환경변수
        Authorization: `Bearer ${process.env.NOTION_SECRET_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      next: { revalidate: 3600 }, // 초단위
    },
  );

  const data: FaqListResponse = await response.json();

  const sortedResults = (data?.results ?? []).sort(
    (a, b) => a.properties.id.number - b.properties.id.number,
  );

  // 클라이언트 컴포넌트로 넘어가는 RSC payload를 줄이기 위해 화면에서 쓰는 텍스트만 남깁니다.
  // Notion은 굵게·링크 등 서식이 바뀔 때마다 텍스트를 여러 조각으로 나누므로 모든 조각을 이어 붙입니다.
  return sortedResults.map((result) => ({
    title: result.properties.title.title.map((text) => text.plain_text).join('') || undefined,
    content: result.properties.content.rich_text.map((text) => text.plain_text).join(''),
  }));
};

export default async function Faq(props: { searchParams: Promise<{ openIndex?: string }> }) {
  const searchParams = await props.searchParams;

  const { openIndex } = searchParams;

  const data = await getFaqData();

  return <FaqPage data={data} openIndex={openIndex ? Number(openIndex) : undefined} />;
}

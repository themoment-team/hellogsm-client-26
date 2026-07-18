import { FaqListResponse, FaqPageData } from '@repo/types';

import { FaqPage } from '@/pageContainer';

const getFaqData = async (): Promise<FaqPageData[]> => {
  const response = await fetch(
    new URL(
      `https://api.notion.com/v1/databases/${process.env.NEXT_PUBLIC_NOTION_FAQ_DATABASE_ID}/query`,
    ),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTION_SECRET_API_KEY}`,
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

  return sortedResults;
};

export default async function Faq(
  props: {
    searchParams: Promise<{ openIndex?: string }>;
  }
) {
  const searchParams = await props.searchParams;

  const {
    openIndex
  } = searchParams;

  const data = await getFaqData();

  return <FaqPage data={data} openIndex={openIndex ? Number(openIndex) : undefined} />;
}

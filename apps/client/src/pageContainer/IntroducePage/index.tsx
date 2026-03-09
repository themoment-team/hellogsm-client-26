import { Footer, TeamSection1, TeamSection2, TeamSection3, TeamSection4 } from 'client/components';

import type { MemberListResponse, MemberPageData } from 'types';

const getMemberData = async (): Promise<MemberPageData[]> => {
  const response = await fetch(
    new URL(
      `https://api.notion.com/v1/databases/${process.env.NEXT_PUBLIC_NOTION_MEMBER_DATABASE_ID}/query`,
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

  const data: MemberListResponse = await response.json();

  const sortedResults = (data?.results ?? []).sort(
    (a, b) => a.properties.id.number - b.properties.id.number,
  );

  return sortedResults;
};

const IntroducePage = async () => {
  const data = await getMemberData();

  return (
    <>
      <TeamSection1 />
      <TeamSection2 />
      <TeamSection3 />
      <TeamSection4 data={data} />
      <Footer />
    </>
  );
};

export default IntroducePage;

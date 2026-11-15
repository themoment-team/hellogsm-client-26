import { CallbackPage } from '@/pageContainer';

const getSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined;

export default async function Callback(props: {
  searchParams: Promise<{ code?: string | string[]; state?: string | string[] }>;
}) {
  const searchParams = await props.searchParams;

  // state 검증과 state 쿠키 삭제는 CallbackPage가 Server Action(./actions.ts)으로 처리한다.
  return (
    <CallbackPage
      code={getSingleParam(searchParams.code)}
      state={getSingleParam(searchParams.state)}
    />
  );
}

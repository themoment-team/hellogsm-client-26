import { CallbackPage } from '@/pageContainer';

export default async function Callback(
  props: {
    searchParams: Promise<{ code: string; state: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return <CallbackPage code={searchParams.code} provider={searchParams.state} />;
}

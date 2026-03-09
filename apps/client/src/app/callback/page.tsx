import { CallbackPage } from 'client/pageContainer';

export default function Callback({
  searchParams,
}: {
  searchParams: { code: string; state: string };
}) {
  return <CallbackPage code={searchParams.code} provider={searchParams.state} />;
}

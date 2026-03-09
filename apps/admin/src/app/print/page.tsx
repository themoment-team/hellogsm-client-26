import { TicketPage } from '@/pageContainer';

import { getAdmissionTickets } from '../apis';

export default async function Print() {
  const data = await getAdmissionTickets({ redirectUrl: '/' });

  return <TicketPage initialData={data} />;
}

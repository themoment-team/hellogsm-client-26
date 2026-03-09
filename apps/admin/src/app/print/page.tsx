import { getAdmissionTickets } from 'admin/app/apis/oneseo/getAdmissionTickets';
import { TicketPage } from 'admin/pageContainer';

export default async function Print() {
  const data = await getAdmissionTickets({ redirectUrl: '/' });

  return <TicketPage initialData={data} />;
}

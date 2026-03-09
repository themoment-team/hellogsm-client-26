import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { oneseoUrl } from 'api/libs';

import { TicketType } from 'types/oneseo';

interface GetAdmissionTicketsParams {
  redirectUrl: string;
}

/**
 * 수험표 출력 정보를 가져옵니다.
 *
 * @returns 수험표 추력 정보를 반환합니다. 수험표그 없다면 빈 배열을 리턴합니다.
 */
export const getAdmissionTickets = async ({
  redirectUrl,
}: GetAdmissionTicketsParams): Promise<TicketType[]> => {
  const session = cookies().get('SESSION')?.value;

  const response = await fetch(
    new URL(oneseoUrl.getAdmissionTickets(), process.env.NEXT_PUBLIC_API_BASE_URL),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    },
  );

  const isNotFound = response.status === 404;

  if (isNotFound) {
    return [];
  }

  const tickets = await response.json();

  if (!response.ok) {
    return redirect(redirectUrl);
  }

  return tickets.data;
};

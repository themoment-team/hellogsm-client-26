jest.mock('api');

import { getDate } from 'api';

import { getIsServerHealthy } from 'client/utils';

describe('getIsServerHealthy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('서버가 정상일 때 true가 반환되어야 한다.', async () => {
    (getDate as jest.Mock).mockResolvedValue({
      oneseoSubmissionStart: '2025-06-24T14:36:19.430Z',
      oneseoSubmissionEnd: '2025-06-24T14:36:19.430Z',
      firstResultsAnnouncement: '2025-06-24T14:36:19.430Z',
      competencyEvaluation: '2025-06-24T14:36:19.430Z',
      inDepthInterview: '2025-06-24T14:36:19.430Z',
      finalResultsAnnouncement: '2025-06-24T14:36:19.430Z',
    });
    const result = await getIsServerHealthy();

    expect(result).toBe(true);
  });

  test('서버가 undefined를 반환할 때 false가 반환되어야 한다.', async () => {
    (getDate as jest.Mock).mockResolvedValue(undefined);
    const result = await getIsServerHealthy();

    expect(result).toBe(false);
  });
});

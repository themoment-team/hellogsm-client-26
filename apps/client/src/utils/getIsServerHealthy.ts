import { getDate } from '@repo/api/apis';

const getIsServerHealthy = async () => {
  const dateList = await getDate();

  return !!dateList;
};

export default getIsServerHealthy;

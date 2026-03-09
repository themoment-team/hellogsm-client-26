import { getDate } from 'api';

const getIsServerHealthy = async () => {
  const dateList = await getDate();

  return !!dateList;
};

export default getIsServerHealthy;

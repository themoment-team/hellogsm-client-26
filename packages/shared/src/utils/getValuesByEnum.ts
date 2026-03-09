/**
 * enum의 값을 배열로 반환합니다
 *
 *
 * @param enumeration
 * @returns type에 따른 배열을 반환합니다.
 */

const getValuesByEnum = <T>(enumeration: { [key: string]: T }) =>
  Object.values(enumeration) as [T, ...T[]];

export default getValuesByEnum;

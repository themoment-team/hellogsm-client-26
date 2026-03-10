export const scrollToElement = (element: string) => {
  document.querySelector(element)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const scrollToLocation = (locationNumber: number, type: 'auto' | 'smooth') => {
  window.scrollTo({
    top: locationNumber,
    behavior: type,
  });
};

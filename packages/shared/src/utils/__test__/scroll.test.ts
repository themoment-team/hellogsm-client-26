import { scrollToElement, scrollToLocation } from 'shared/utils';

// DOM 모킹
const mockScrollIntoView = jest.fn();
const mockScrollTo = jest.fn();

// querySelector 모킹
Object.defineProperty(document, 'querySelector', {
  value: jest.fn(),
  writable: true,
});

// window.scrollTo 모킹
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('scrollToElement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('요소가 존재하면 해당 요소로 스무스하게 스크롤되어야 한다.', () => {
    const mockElement = { scrollIntoView: mockScrollIntoView };
    (document.querySelector as jest.Mock).mockReturnValue(mockElement);

    scrollToElement('#test-element');

    expect(document.querySelector).toHaveBeenCalledWith('#test-element');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  test('요소가 존재하지 않으면 에러 없이 아무 동작도 하지 않아야 한다.', () => {
    (document.querySelector as jest.Mock).mockReturnValue(null);

    expect(() => scrollToElement('#not-exist')).not.toThrow();
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});

describe('scrollToLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('behavior가 smooth일 때 해당 위치로 스무스하게 스크롤되어야 한다.', () => {
    scrollToLocation(100, 'smooth');

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'smooth',
    });
  });

  test('behavior가 auto일 때 해당 위치로 즉시 스크롤되어야 한다.', () => {
    scrollToLocation(500, 'auto');

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 500,
      behavior: 'auto',
    });
  });
});

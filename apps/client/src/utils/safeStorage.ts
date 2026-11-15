// 저장소가 차단된 환경(개인정보 보호 모드, 쿠키·사이트 데이터 차단 등)에서는 Web Storage 접근 자체가
// SecurityError를 던지므로, 읽기는 null(저장된 값 없음)로 보고 쓰기·삭제는 조용히 건너뛴다.
type StorageType = 'localStorage' | 'sessionStorage';

const safeStorage = {
  getItem: (type: StorageType, key: string): string | null => {
    try {
      return window[type].getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (type: StorageType, key: string, value: string) => {
    try {
      window[type].setItem(key, value);
    } catch {
      // 저장하지 못해도 화면 동작은 그대로 이어간다
    }
  },
  removeItem: (type: StorageType, key: string) => {
    try {
      window[type].removeItem(key);
    } catch {
      // 삭제하지 못해도 화면 동작은 그대로 이어간다
    }
  },
};

export default safeStorage;

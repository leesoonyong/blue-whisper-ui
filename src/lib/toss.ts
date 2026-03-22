import { getAppsInTossGlobals, graniteEvent } from "@apps-in-toss/web-framework";

/**
 * 토스 앱 내부 WebView에서 실행 중인지 확인
 */
export const isInsideToss = (): boolean => {
  try {
    getAppsInTossGlobals();
    return true;
  } catch {
    return false;
  }
};

/**
 * 네이티브 뒤로가기 버튼 이벤트 등록
 * @returns cleanup 함수
 */
export const registerBackEvent = (onBack: () => void): (() => void) => {
  if (!isInsideToss()) return () => {};
  return graniteEvent.addEventListener("backEvent", { onEvent: onBack });
};

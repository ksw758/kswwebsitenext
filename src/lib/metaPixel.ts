declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// 개인정보(이름·연락처·이메일 등)는 절대 params 에 넣지 않는다.
type PixelParams = Record<string, string | number | boolean>;

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

/** 표준 이벤트 'Lead' — 연락처를 남긴 진짜 전환. 광고 최적화 기준 이벤트. */
export function trackLead(params?: PixelParams) {
  fbq('track', 'Lead', params);
}

/** 설문 시작 버튼 클릭 (커스텀 이벤트) */
export function trackSurveyStart() {
  fbq('trackCustom', 'SurveyStart');
}

/** 설문 제출 후 견적 결과가 정상 생성됨 (커스텀 이벤트) */
export function trackSurveyComplete() {
  fbq('trackCustom', 'SurveyComplete');
}

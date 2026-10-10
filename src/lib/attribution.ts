/**
 * 광고 유입 정보(UTM · fbclid) 저장 — 어떤 광고 소재에서 문의가 왔는지 구분하기 위함.
 * 클라이언트: captureAttribution() 으로 저장, getAttribution() 으로 제출 시 첨부.
 * 서버: sanitizeAttribution() 으로 검증 후 메일 본문에 formatAttribution() 으로 출력.
 */
const STORAGE_KEY = 'sw:attribution';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_LEN = 100;

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

export type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

/** 현재 URL 에 UTM/fbclid 가 있으면 저장한다. 없으면 기존 값을 유지(광고 유입 보존). */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, MAX_LEN);
    }
    if (Object.keys(found).length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), data: found }));
  } catch {
    /* 저장소 접근 불가 환경 무시 */
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: Attribution };
    if (!at || Date.now() - at > TTL_MS) return null;
    return sanitizeAttribution(data);
  } catch {
    return null;
  }
}

/** 알려진 키만, 문자열만, 길이 제한을 걸어 통과시킨다. (서버/클라이언트 공용) */
export function sanitizeAttribution(input: unknown): Attribution | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const src = input as Record<string, unknown>;
  const out: Attribution = {};
  for (const k of KEYS) {
    const v = src[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, MAX_LEN);
  }
  return Object.keys(out).length ? out : null;
}

export function formatAttribution(a: Attribution | null): string {
  if (!a) return '유입 정보: (직접 방문 또는 UTM 없음)';
  return ['유입 정보:', ...KEYS.filter((k) => a[k]).map((k) => `  ${k}: ${a[k]}`)].join('\n');
}

/**
 * 인메모리 슬라이딩 윈도우 레이트리밋.
 * 서버리스 인스턴스별로 상태가 유지되고 재배포·스케일아웃 시 초기화된다(베스트 에포트).
 * Fluid Compute의 인스턴스 재사용 덕에 버스트는 상당 부분 흡수되며,
 * 인스턴스 간 정확한 카운팅이 필요해지면 Upstash Redis 등으로 교체한다.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  // 키가 무한정 쌓이지 않도록 가끔 만료 항목을 청소한다.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    const retryAfterSec = Math.ceil((timestamps[0] + windowMs - now) / 1000);
    return { ok: false, retryAfterSec: Math.max(retryAfterSec, 1) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { ok: true, retryAfterSec: 0 };
}

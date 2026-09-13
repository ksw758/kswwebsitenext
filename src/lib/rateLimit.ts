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

/**
 * Vercel에서 신뢰 가능한 클라이언트 IP를 뽑는다.
 * `x-forwarded-for`의 맨 앞 항목은 클라이언트가 임의로 붙일 수 있으므로 레이트리밋 키로 쓰면 안 된다.
 * Vercel이 세팅하는 `x-real-ip`를 우선 쓰고, 없으면 `x-forwarded-for`의 마지막(프록시가 덧붙인 실제) 항목을 쓴다.
 */
export function clientIp(req: Request): string {
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return 'unknown';
}

/**
 * IP + User-Agent 를 합친 레이트리밋 키.
 * 같은 사용자가 새로고침·재요청으로 비싼 엔드포인트(견적 생성 등)를 반복 호출하는 것을 억제한다.
 * IP 만으로는 공유망(회사·카페)에서 과차단, UA 만으로는 식별력이 약하므로 둘을 함께 쓴다.
 * UA 는 길어질 수 있어 djb2 로 짧게 해시한다.
 */
export function clientFingerprint(req: Request): string {
  const ua = req.headers.get('user-agent') ?? '';
  let hash = 5381;
  for (let i = 0; i < ua.length; i++) hash = ((hash << 5) + hash + ua.charCodeAt(i)) | 0;
  return `${clientIp(req)}:${(hash >>> 0).toString(36)}`;
}

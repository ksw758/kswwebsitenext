/**
 * 블로그 작성 기능은 로컬 환경에서만 허용한다.
 * Vercel 배포본(production·preview)에서는 작성 페이지와 작성 API를 모두 차단해
 * 무인증 상태로 글 생성·Blob 업로드·LinkedIn/로켓펀치 크로스포스팅이 트리거되지 않도록 한다.
 * 로컬(`next dev`/`next start`)은 `VERCEL_ENV`가 없고, `vercel dev`는 `development`이므로 허용된다.
 */
export function isBlogWriteEnabled(): boolean {
  const env = process.env.VERCEL_ENV;
  return env !== 'production' && env !== 'preview';
}

/**
 * 동일 출처 요청인지 확인한다. 브라우저는 cross-origin POST에 항상 `Origin`을 붙이므로
 * 정상적인 사이트 내 요청은 통과하고, 스크립트·타 사이트 임베드·비브라우저 클라이언트는 걸러진다.
 * 프로덕션·프리뷰·localhost·향후 커스텀 도메인 모두 무설정으로 대응된다.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

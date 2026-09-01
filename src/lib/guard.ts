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
 * 요청의 `Origin` 헤더 호스트가 `Host` 헤더와 일치하는지 확인한다.
 * 막아주는 것: 다른 사이트에서의 cross-origin 호출(CSRF성 요청), 타 사이트 iframe 임베드,
 * `Origin`을 안 붙이는 게으른 스크래퍼.
 * 막아주지 못하는 것: `Origin`/`Host`를 직접 세팅하는 curl·스크립트. 즉 인증 경계가 아니다.
 * 스크립트 남용의 실질 방어선은 레이트리밋과 입력 크기 제한, 그리고 OpenAI 예산 하드캡이다.
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

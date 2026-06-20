async function uploadImageToLinkedIn(accessToken: string, personUrn: string, imageUrl: string): Promise<string> {
  // 1. 업로드 등록
  const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: personUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
      },
    }),
  });

  const registerData = await registerRes.json();
  const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const asset = registerData.value.asset;

  // 2. 이미지 바이너리 가져와서 LinkedIn에 업로드
  const imageRes = await fetch(imageUrl);
  const imageBuffer = await imageRes.arrayBuffer();

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: imageBuffer,
  });

  return asset;
}

export async function postToLinkedIn(
  title: string,
  content: string,
  thumbnailUrl: string,
  hashtags: string[],
) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const personUrn = process.env.LINKEDIN_PERSON_URN!;

  const hashtagText = hashtags.length > 0
    ? '\n\n' + hashtags.map(h => `#${h.replace(/\s/g, '')}`).join(' ')
    : '';

  const text = `${title}\n\n${content.slice(0, 700)}${content.length > 700 ? '...' : ''}${hashtagText}`;

  // 이미지 업로드
  const asset = await uploadImageToLinkedIn(accessToken, personUrn, thumbnailUrl);

  const body = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'IMAGE',
        media: [
          {
            status: 'READY',
            media: asset,
            title: { text: title },
          },
        ],
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`LinkedIn 포스팅 실패: ${JSON.stringify(err)}`);
  }

  return res.json();
}

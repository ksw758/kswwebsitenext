'use client';

import React, { useState, useRef } from 'react';
import { theme } from '@/src/const';

const CATEGORIES = [
  { value: 'FREE', label: '자유' },
  { value: 'DEVELOP', label: '개발' },
  { value: 'GAME', label: '게임' },
  { value: 'SPORT', label: '스포츠' },
  { value: 'SHOW', label: '방송/공연' },
] as const;

const PLATFORMS = [
  { key: 'blog', label: '개인 블로그', icon: '🏠' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'rocketpunch', label: '로켓펀치', icon: '🚀' },
] as const;

type Platform = typeof PLATFORMS[number]['key'];
type Category = typeof CATEGORIES[number]['value'];
type Status = 'idle' | 'loading' | 'success' | 'error';

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: `${theme.color.parchment}22`,
  border: `1px solid ${theme.color.gold}55`,
  borderRadius: 4,
  padding: '12px 14px',
  fontFamily: theme.font.serif,
  fontSize: 14,
  color: theme.color.parchment,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: theme.font.serif,
  fontSize: 10,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: theme.color.gold,
  marginBottom: 8,
};

export default function BlogWriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('DEVELOP');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(
    new Set(['blog', 'linkedin', 'rocketpunch'])
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!title.trim()) return '제목을 입력해주세요.';
    if (!content.trim()) return '내용을 입력해주세요.';
    if (!image) return '썸네일 이미지를 첨부해주세요.';
    return null;
  };

  const handleSaveClick = () => {
    const err = validate();
    if (err) { setErrorMsg(err); setStatus('error'); return; }
    setErrorMsg('');
    setShowPlatformModal(true);
  };

  const togglePlatform = (key: Platform) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = async () => {
    setShowPlatformModal(false);
    setStatus('loading');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('hashtags', hashtags);
    formData.append('thumbnail', image!);
    formData.append('platforms', JSON.stringify(Array.from(selectedPlatforms)));

    try {
      const res = await fetch('/api/v1/blog', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? '서버 오류');
      }
      setStatus('success');
      setTitle(''); setContent(''); setHashtags(''); setImage(null); setPreview(null);
    } catch (e) {
      setErrorMsg(String(e));
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px' }}>
      <p style={{ fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold, marginBottom: 16 }}>
        블로그 작성
      </p>
      <h1 style={{ fontFamily: theme.font.serif, fontSize: 28, fontWeight: 700, color: theme.color.parchment, marginBottom: 40 }}>
        새 글 작성
      </h1>

      {/* 제목 */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>제목 *</label>
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="블로그 제목을 입력하세요" />
      </div>

      {/* 카테고리 */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>카테고리</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value} style={{ background: theme.color.sepia }}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 썸네일 */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>썸네일 이미지 *</label>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1px dashed ${theme.color.gold}66`,
            borderRadius: 4,
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'center',
            background: `${theme.color.parchment}0A`,
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 4, objectFit: 'cover' }} />
          ) : (
            <p style={{ fontFamily: theme.font.serif, fontSize: 13, color: `${theme.color.parchment}66` }}>
              클릭해서 이미지를 선택하세요 (jpg, png, webp)
            </p>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
      </div>

      {/* 내용 */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>내용 *</label>
        <textarea
          style={{ ...inputStyle, minHeight: 320, resize: 'vertical', lineHeight: 1.8 }}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="블로그 내용을 작성하세요..."
        />
      </div>

      {/* 해시태그 */}
      <div style={{ marginBottom: 36 }}>
        <label style={labelStyle}>해시태그 (쉼표로 구분)</label>
        <input
          style={inputStyle}
          value={hashtags}
          onChange={e => setHashtags(e.target.value)}
          placeholder="예: Next.js, 바이브코딩, 외주"
        />
      </div>

      {/* 상태 메시지 */}
      {status === 'success' && (
        <p style={{ fontFamily: theme.font.serif, fontSize: 13, color: theme.color.gold, marginBottom: 16, textAlign: 'center' }}>
          블로그가 성공적으로 저장되었습니다.
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontFamily: theme.font.serif, fontSize: 13, color: '#E74C3C', marginBottom: 16, textAlign: 'center' }}>
          {errorMsg}
        </p>
      )}

      {/* 제출 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleSaveClick}
          disabled={status === 'loading'}
          style={{
            fontFamily: theme.font.serif,
            fontSize: 11,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: theme.color.gold,
            background: 'transparent',
            border: `1px solid ${theme.color.gold}`,
            padding: '14px 56px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.6 : 1,
            borderRadius: 0,
          }}
        >
          {status === 'loading' ? '저장 중...' : '블로그 저장'}
        </button>
      </div>

      {/* 플랫폼 선택 모달 */}
      {showPlatformModal && (
        <div
          onClick={() => setShowPlatformModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: theme.color.sepia,
              border: `1px solid ${theme.color.gold}44`,
              borderRadius: 8,
              padding: '40px 48px',
              minWidth: 340,
            }}
          >
            <p style={{ fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: theme.color.gold, marginBottom: 12 }}>
              업로드 플랫폼
            </p>
            <h2 style={{ fontFamily: theme.font.serif, fontSize: 20, color: theme.color.parchment, marginBottom: 28, fontWeight: 600 }}>
              어떤 플랫폼에 업로드할까요?
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {PLATFORMS.map(p => (
                <label
                  key={p.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                    padding: '14px 16px',
                    border: `1px solid ${selectedPlatforms.has(p.key) ? theme.color.gold : theme.color.gold + '33'}`,
                    borderRadius: 4,
                    background: selectedPlatforms.has(p.key) ? `${theme.color.gold}11` : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.has(p.key)}
                    onChange={() => togglePlatform(p.key)}
                    style={{ accentColor: theme.color.gold, width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ fontFamily: theme.font.serif, fontSize: 14, color: theme.color.parchment }}>
                    {p.label}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowPlatformModal(false)}
                style={{
                  flex: 1,
                  fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '2px',
                  textTransform: 'uppercase', color: `${theme.color.parchment}88`,
                  background: 'transparent',
                  border: `1px solid ${theme.color.parchment}33`,
                  padding: '12px 0', cursor: 'pointer', borderRadius: 0,
                }}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedPlatforms.size === 0}
                style={{
                  flex: 2,
                  fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '2px',
                  textTransform: 'uppercase', color: theme.color.gold,
                  background: 'transparent',
                  border: `1px solid ${theme.color.gold}`,
                  padding: '12px 0', cursor: selectedPlatforms.size === 0 ? 'not-allowed' : 'pointer',
                  opacity: selectedPlatforms.size === 0 ? 0.4 : 1,
                  borderRadius: 0,
                }}
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

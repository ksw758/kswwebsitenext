'use client';

import {useChat} from '@ai-sdk/react';
import {DefaultChatTransport, UIMessage} from 'ai';
import {useEffect, useRef, useState} from 'react';
import {theme} from '@/src/const';

const transport = new DefaultChatTransport({api: '/api/chat'});

const ChatBotButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    const {messages, sendMessage, status} = useChat({
        transport,
        onFinish: ({message}) => {
            const text = message.parts
                .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                .map((p) => p.text)
                .join('');
            if (text.includes('{{SCROLL_TO_CONTACT}}')) {
                setTimeout(() => {
                    setIsOpen(false);
                    document.getElementById('Contact')?.scrollIntoView({behavior: 'smooth'});
                }, 600);
            }
        },
    });
    const isLoading = status === 'submitted' || status === 'streaming';

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({text: input});
        setInput('');
    };

    return (
        <>
            {/* Chat window */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 100,
                        right: 32,
                        width: 340,
                        height: 480,
                        backgroundColor: '#1a1208',
                        border: `1.5px solid ${theme.color.gold}`,
                        borderRadius: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 9998,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '14px 18px',
                            borderBottom: `1px solid ${theme.color.goldFaded}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: theme.color.gold,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                flexShrink: 0,
                            }}
                        >
                            🤖
                        </div>
                        <div>
                            <div style={{color: theme.color.gold, fontWeight: 700, fontSize: 14}}>
                                James 챗봇
                            </div>
                            <div style={{color: theme.color.goldFaded, fontSize: 11}}>
                                개발 문의는 무엇이든 물어보세요.
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '14px 14px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    color: theme.color.goldFaded,
                                    fontSize: 13,
                                    textAlign: 'center',
                                    marginTop: 40,
                                    lineHeight: 1.8,
                                }}
                            >
                                안녕하세요! 👋<br/>
                                개발 경력, 프로젝트, 외주 문의 등<br/>
                                무엇이든 질문해 주세요.
                            </div>
                        )}

                        {messages.map((m: UIMessage) => {
                            const text = m.parts
                                .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                                .map((p) => p.text)
                                .join('')
                                .replace('{{SCROLL_TO_CONTACT}}', '')
                                .trim();
                            return (
                                <div
                                    key={m.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '80%',
                                            padding: '9px 13px',
                                            borderRadius:
                                                m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            backgroundColor: m.role === 'user' ? theme.color.gold : '#2a1f0a',
                                            color: m.role === 'user' ? theme.color.sepia : theme.color.parchment,
                                            fontSize: 13,
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {text}
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                                <div
                                    style={{
                                        padding: '9px 16px',
                                        borderRadius: '16px 16px 16px 4px',
                                        backgroundColor: '#2a1f0a',
                                        color: theme.color.goldFaded,
                                        fontSize: 18,
                                        letterSpacing: 3,
                                    }}
                                >
                                    ···
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} style={{height: 14}}/>
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: '10px 12px',
                            borderTop: `1px solid ${theme.color.goldFaded}`,
                            display: 'flex',
                            gap: 8,
                        }}
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                flex: 1,
                                backgroundColor: '#2a1f0a',
                                border: `1px solid ${theme.color.goldFaded}`,
                                borderRadius: 20,
                                padding: '8px 14px',
                                color: theme.color.parchment,
                                fontSize: 13,
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor:
                                    input.trim() && !isLoading ? theme.color.gold : theme.color.goldFaded,
                                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'background-color 150ms ease',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M22 2L11 13"
                                    stroke={theme.color.sepia}
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M22 2L15 22L11 13L2 9L22 2Z"
                                    stroke={theme.color.sepia}
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="AI 챗봇 문의"
                style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: `2px solid ${theme.color.gold}`,
                    backgroundColor: isOpen ? theme.color.gold : theme.color.sepia,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(200,168,75,0.35)',
                    zIndex: 9999,
                    transition:
                        'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,168,75,0.55)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,168,75,0.35)';
                }}
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke={theme.color.sepia}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z"
                            fill={theme.color.gold}
                            opacity="0.15"
                        />
                        <path
                            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z"
                            stroke={theme.color.gold}
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                        />
                        <circle cx="8.5" cy="12" r="1.2" fill={theme.color.gold}/>
                        <circle cx="12" cy="12" r="1.2" fill={theme.color.gold}/>
                        <circle cx="15.5" cy="12" r="1.2" fill={theme.color.gold}/>
                    </svg>
                )}
            </button>
        </>
    );
};

export default ChatBotButton;

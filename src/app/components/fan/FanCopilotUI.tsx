'use client';

import React from 'react';
import { fanCopilotService, CopilotResponse } from '../../../lib/fan/copilot/fan-copilot.service';
import { fanContextService } from '../../../lib/fan/context/fan-context.service';
import { multilingualService } from '../../../lib/fan/localization/multilingual.service';
import { NavigationRoute } from '../../../lib/fan/types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface Props {
  onRouteReceived: (route: NavigationRoute) => void;
}

export default function FanCopilotUI({ onRouteReceived }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [lang, setLang] = React.useState(fanContextService.getContext().language);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleLangChange = () => setLang(fanContextService.getContext().language);
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  React.useEffect(() => {
    // Initial greeting
    const greet = async () => {
      const welcome = multilingualService.t('fan.welcome', lang);
      setMessages([{ id: 'init', sender: 'ai', text: `${welcome}! How can I assist you today?` }]);
    };
    greet();
  }, [lang]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);

    try {
      const response = await fanCopilotService.processQuery(userText);

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: response.message },
      ]);

      if (response.action?.type === 'ROUTE' || response.action?.type === 'ALERT') {
        onRouteReceived(response.action.data as NavigationRoute);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
      }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 300 }}>ArenaMind Copilot</h2>
        <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>
          ● Online & Context Aware
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#38BDF8' : 'rgba(255,255,255,0.1)',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              maxWidth: '85%',
              lineHeight: 1.5,
              fontSize: '14px',
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={multilingualService.t('fan.copilot.placeholder', lang)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px',
              padding: '16px 48px 16px 20px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              bottom: '8px',
              width: '32px',
              background: '#38BDF8',
              border: 'none',
              borderRadius: '50%',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { SupportedLanguage } from '../../../lib/fan/types';
import { fanContextService } from '../../../lib/fan/context/fan-context.service';
import { multilingualService } from '../../../lib/fan/localization/multilingual.service';

const languages: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' },
];

export default function MultilingualSelector() {
  const [currentLang, setCurrentLang] = React.useState<SupportedLanguage>(
    fanContextService.getContext().language
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as SupportedLanguage;
    setCurrentLang(lang);
    fanContextService.setLanguage(lang);
    // Force a re-render or trigger a global state update in a real app
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}>
      <select
        value={currentLang}
        onChange={handleChange}
        style={{
          padding: '8px 12px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ color: '#000' }}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

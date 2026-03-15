'use client';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    const accepted = localStorage.getItem('disclaimerAccepted');
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    if (!accepted) setShowDisclaimer(true);
  }, []);

  const setThemeMode = (t: string) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t);
    setShowPanel(false);
  };

  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  const themes = [
    { id: 'light', label: '☀️ Light', desc: 'Default' },
    { id: 'dark', label: '🌙 Dark', desc: 'Night mode' },
    { id: 'warm', label: '🌅 Warm', desc: 'Eye comfort' },
  ];

  const icon = theme === 'dark' ? '🌙' : theme === 'warm' ? '🌅' : '☀️';

  return (
    <>
      {showDisclaimer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚕️</div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Medical Disclaimer</h2>
            </div>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ color: '#991b1b', fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0' }}>⚠️ IMPORTANT — Please Read</p>
              <p style={{ color: '#b91c1c', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>MedicalPlain provides AI-generated information for <strong>educational purposes only</strong>. It is NOT a substitute for professional medical advice, diagnosis, or treatment.</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              {['Always consult a qualified doctor before taking any medication', 'Never disregard professional medical advice based on AI output', 'In emergencies, call 108 (Ambulance) or 112 immediately', 'AI analysis may not be 100% accurate — verify with a doctor', 'You are responsible for your own medical decisions'].map((item, i) => (
                <p key={i} style={{ fontSize: '12px', color: '#374151', margin: '4px 0' }}>✅ {item}</p>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginBottom: '16px' }}>By continuing, you acknowledge MedicalPlain is not liable for any health decisions made based on this information.</p>
            <button onClick={acceptDisclaimer} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              I Understand — Continue
            </button>
          </div>
        </div>
      )}

      {/* Floating theme button — fixed bottom right, small */}
      <div style={{ position: 'fixed', bottom: '80px', right: '16px', zIndex: 1000 }}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer' }}>
          {icon}
        </button>

        {showPanel && (
          <div style={{ position: 'absolute', bottom: '52px', right: 0, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '12px', width: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Display Mode</p>
            {themes.map(t => (
              <button key={t.id} onClick={() => setThemeMode(t.id)} style={{
                width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginBottom: '4px', display: 'block',
                backgroundColor: theme === t.id ? '#2563eb' : 'transparent',
                color: theme === t.id ? 'white' : 'var(--text-primary)',
              }}>
                <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{t.label}</p>
                <p style={{ fontSize: '11px', margin: 0, opacity: 0.7 }}>{t.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {children}
    </>
  );
}

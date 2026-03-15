'use client';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);

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
    setShowThemePanel(false);
  };

  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  return (
    <>
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">⚕️</div>
              <h2 className="text-xl font-bold text-gray-900">Medical Disclaimer</h2>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <p className="text-red-800 text-sm font-semibold mb-2">⚠️ IMPORTANT — Please Read</p>
              <p className="text-red-700 text-xs leading-relaxed">MedicalPlain provides AI-generated information for <strong>educational purposes only</strong>. It is NOT a substitute for professional medical advice, diagnosis, or treatment.</p>
            </div>
            <div className="space-y-2 mb-5 text-xs text-gray-600">
              <p>✅ Always consult a qualified doctor before taking any medication</p>
              <p>✅ Never disregard professional medical advice based on AI output</p>
              <p>✅ In emergencies, call 108 (Ambulance) or 112 immediately</p>
              <p>✅ AI analysis may not be 100% accurate — verify with a doctor</p>
              <p>✅ You are responsible for your own medical decisions</p>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">By continuing, you acknowledge that MedicalPlain is not liable for any health decisions made based on this information.</p>
            <button onClick={acceptDisclaimer}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-sm">
              I Understand — Continue
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-20 right-4 z-40">
        <button onClick={() => setShowThemePanel(!showThemePanel)}
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {theme === 'dark' ? '🌙' : theme === 'warm' ? '🌅' : '☀️'}
        </button>
        {showThemePanel && (
          <div className="absolute bottom-12 right-0 rounded-2xl shadow-xl p-3 w-48"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Display Mode</p>
            {[
              { id: 'light', label: '☀️ Light Mode', desc: 'Default' },
              { id: 'dark', label: '🌙 Dark Mode', desc: 'Easy on eyes at night' },
              { id: 'warm', label: '🌅 Warm Mode', desc: 'Sepia tone — eye comfort' },
            ].map(t => (
              <button key={t.id} onClick={() => setThemeMode(t.id)}
                className="w-full text-left p-2 rounded-xl mb-1 transition-all"
                style={{ backgroundColor: theme === t.id ? 'var(--blue-accent)' : 'transparent', color: theme === t.id ? 'white' : 'var(--text-primary)' }}>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs opacity-70">{t.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {children}
    </>
  );
}

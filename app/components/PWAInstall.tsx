'use client';
import { useEffect, useState } from 'react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const dismissed = sessionStorage.getItem('pwaDismissed');
    if (dismissed) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 5000);
    });
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    sessionStorage.setItem('pwaDismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-3"
      style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--blue-accent)' }}>
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">M</div>
      <div className="flex-1">
        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Install MedicalPlain</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Add to home screen for quick access</p>
      </div>
      <div className="flex gap-2">
        <button onClick={dismiss} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>✕</button>
        <button onClick={install} className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">Install</button>
      </div>
    </div>
  );
}

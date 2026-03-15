'use client';
import { useEffect, useState } from 'react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 3000);
    });
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-3">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">M</div>
      <div className="flex-1">
        <p className="font-bold text-gray-900 text-sm">Install MedicalPlain</p>
        <p className="text-xs text-gray-500">Add to home screen for quick access</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowBanner(false)} className="text-gray-400 text-sm px-2">Not now</button>
        <button onClick={install} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl font-semibold">Install</button>
      </div>
    </div>
  );
}

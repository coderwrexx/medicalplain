'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const h = localStorage.getItem('medHistory');
    const r = localStorage.getItem('medReminders');
    if (h) setHistoryCount(JSON.parse(h).length);
    if (r) setReminderCount(JSON.parse(r).filter((x: any) => x.active).length);
  }, []);

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const mimeType = file.type || 'image/jpeg';
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        });
        const data = await response.json();
        localStorage.setItem('analysisResult', JSON.stringify(data));
        const history = JSON.parse(localStorage.getItem('medHistory') || '[]');
        history.unshift({
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          documentType: data.documentType || 'document',
          summary: data.summary || '',
          riskScore: data.overallRiskScore || '',
          data: data,
        });
        localStorage.setItem('medHistory', JSON.stringify(history.slice(0, 20)));
        router.push('/results');
      } catch {
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const tools = [
    { icon: '👨‍⚕️', title: 'Ask Doctor', desc: 'MBBS AI with voice', action: () => router.push('/chat'), color: 'bg-blue-600', badge: null },
    { icon: '🩺', title: 'Symptom Check', desc: 'Identify conditions', action: () => router.push('/symptoms'), color: 'bg-green-600', badge: null },
    { icon: '🔄', title: 'Drug Interactions', desc: 'Check drug safety', action: () => router.push('/interactions'), color: 'bg-orange-500', badge: null },
    { icon: '💊', title: 'Drug Database', desc: 'Any medicine info', action: () => router.push('/drugs'), color: 'bg-purple-600', badge: null },
    { icon: '📊', title: 'Health Dashboard', desc: 'BMI, BP, sugar', action: () => router.push('/dashboard'), color: 'bg-teal-600', badge: null },
    { icon: '🧠', title: 'Mental Health', desc: 'PHQ-9 screening', action: () => router.push('/mental'), color: 'bg-indigo-600', badge: null },
    { icon: '🍎', title: 'Nutrition AI', desc: 'Analyze any food', action: () => router.push('/nutrition'), color: 'bg-lime-600', badge: null },
    { icon: '⏰', title: 'Med Reminders', desc: reminderCount > 0 ? `${reminderCount} active` : 'Never miss dose', action: () => router.push('/reminders'), color: 'bg-red-500', badge: reminderCount > 0 ? reminderCount : null },
    { icon: '📋', title: 'Health History', desc: historyCount > 0 ? `${historyCount} records` : 'Past analyses', action: () => router.push('/history'), color: 'bg-gray-600', badge: historyCount > 0 ? historyCount : null },
    { icon: '🚨', title: 'Emergency', desc: '108 • First aid', action: () => router.push('/emergency'), color: 'bg-red-700', badge: null },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-5">

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs mb-2">
            🏥 World-Class Medical AI
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">MedicalPlain</h1>
          <p className="text-gray-600 text-sm">Your complete personal medical AI — for every health question</p>
          <div className="flex justify-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span>✅ Free</span><span>✅ MBBS-level AI</span><span>✅ Voice enabled</span><span>✅ Works offline</span>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {loading ? (
            <div>
              <div className="text-4xl mb-2">🔬</div>
              <p className="font-semibold text-blue-600">Running clinical analysis...</p>
              <p className="text-gray-500 text-sm mt-1">Checking drugs, interactions, risk scores</p>
              <div className="mt-3 bg-blue-100 rounded-full h-1.5 w-40 mx-auto overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"/>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-2">📋</div>
              <p className="text-lg font-semibold text-gray-700">Upload Medical Document</p>
              <p className="text-gray-500 text-sm">Prescription • Lab Report • Discharge Summary</p>
              <p className="text-xs text-gray-400 mt-1">JPG • PNG • PDF</p>
              <div className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-full inline-block text-sm font-medium">Choose File</div>
            </div>
          )}
        </div>

        <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

        <div className="grid grid-cols-2 gap-3 mb-4">
          {tools.map((t, i) => (
            <button key={i} onClick={t.action}
              className="bg-white rounded-2xl p-4 shadow-sm border text-left hover:shadow-md transition-all hover:border-blue-200 relative">
              {t.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {t.badge}
                </span>
              )}
              <div className={`w-10 h-10 ${t.color} rounded-xl flex items-center justify-center text-xl mb-2`}>{t.icon}</div>
              <p className="font-bold text-gray-900 text-sm">{t.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🩺</span>
              <div><p className="font-bold text-green-800 text-sm">Book a real doctor</p><p className="text-xs text-green-600">Trusted by 20 million patients</p></div>
            </div>
            <a href="https://www.practo.com" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap">Practo →</a>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div><p className="font-bold text-blue-800 text-sm">Health Insurance</p><p className="text-xs text-blue-600">Compare plans free</p></div>
            </div>
            <a href="https://www.insurancedekho.com/health-insurance" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap">Get Quote →</a>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <div><p className="font-bold text-red-800 text-sm">Medical Emergency?</p><p className="text-xs text-red-600">Ambulance • First Aid guide</p></div>
            </div>
            <button onClick={() => router.push('/emergency')} className="bg-red-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">SOS →</button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mb-4">
          For educational purposes only. Always consult a doctor for medical decisions. Emergency: 112
        </p>
      </div>
    </main>
  );
}

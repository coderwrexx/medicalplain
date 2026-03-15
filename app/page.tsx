'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('medHistory');
    if (saved) setHistoryCount(JSON.parse(saved).length);
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

  const features = [
    { icon: '📋', title: 'Analyze Document', desc: 'Prescription, lab report, discharge summary', action: () => document.getElementById('fileInput')?.click(), color: 'bg-blue-600' },
    { icon: '👨‍⚕️', title: 'Ask Doctor', desc: 'Chat with MBBS AI doctor', action: () => router.push('/chat'), color: 'bg-purple-600' },
    { icon: '🩺', title: 'Symptom Checker', desc: 'Check what your symptoms mean', action: () => router.push('/symptoms'), color: 'bg-green-600' },
    { icon: '🔄', title: 'Drug Interactions', desc: 'Check if medicines are safe together', action: () => router.push('/interactions'), color: 'bg-orange-500' },
    { icon: '⏰', title: 'Med Reminders', desc: 'Never miss a dose', action: () => router.push('/reminders'), color: 'bg-red-500' },
    { icon: '📋', title: 'Health History', desc: historyCount > 0 ? `${historyCount} records saved` : 'View past analyses', action: () => router.push('/history'), color: 'bg-teal-600' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs mb-3">
            🏥 Pro Medical AI — MBBS Level
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedicalPlain</h1>
          <p className="text-gray-600 text-sm">Your personal AI medical expert — explains everything in simple language</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
            <span>✅ Free</span>
            <span>✅ No signup</span>
            <span>✅ 100% private</span>
            <span>✅ Works offline</span>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-4 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {loading ? (
            <div>
              <div className="text-4xl mb-3">🔬</div>
              <p className="text-lg font-semibold text-blue-600">Running clinical analysis...</p>
              <p className="text-gray-500 text-sm mt-1">Checking drugs, interactions, lab values</p>
              <div className="mt-3 bg-blue-100 rounded-full h-1.5 w-40 mx-auto overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-3">📋</div>
              <p className="text-lg font-semibold text-gray-700">Upload Medical Document</p>
              <p className="text-gray-500 text-sm mt-1">Prescription • Lab Report • Discharge Summary</p>
              <p className="text-xs text-gray-400 mt-2">JPG • PNG • PDF — tap or drag here</p>
              <div className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-full inline-block text-sm font-medium">
                Choose File
              </div>
            </div>
          )}
        </div>

        <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

        <div className="grid grid-cols-2 gap-3 mb-4">
          {features.map((f, i) => (
            <button key={i} onClick={f.action}
              className="bg-white rounded-2xl p-4 shadow-sm border text-left hover:shadow-md transition-all hover:border-blue-200">
              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center text-xl mb-2`}>{f.icon}</div>
              <p className="font-bold text-gray-900 text-sm">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🩺</div>
            <div>
              <p className="font-bold text-green-800">Talk to a real doctor</p>
              <p className="text-green-700 text-xs">Book a consultation on Practo — trusted by millions</p>
            </div>
            <a href="https://www.practo.com" target="_blank" rel="noopener noreferrer"
              className="ml-auto bg-green-600 text-white text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap">
              Book Now
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛡️</div>
            <div>
              <p className="font-bold text-blue-800">Protect your health</p>
              <p className="text-blue-700 text-xs">Get health insurance quotes — free comparison</p>
            </div>
            <a href="https://www.insurancedekho.com/health-insurance" target="_blank" rel="noopener noreferrer"
              className="ml-auto bg-blue-600 text-white text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap">
              Get Quote
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mb-4">
          MedicalPlain is for educational purposes only. Always consult a qualified doctor for medical decisions. For emergencies call 112.
        </p>
      </div>
    </main>
  );
}

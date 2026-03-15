'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

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
        router.push('/results');
      } catch {
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm mb-4">
            <span>🏥</span> Pro Medical AI
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">MedicalPlain</h1>
          <p className="text-lg text-gray-600">MBBS-level AI that explains your medical documents<br/>with clinical precision and full detail</p>
          <p className="text-sm text-gray-400 mt-2">Free • No signup • 100% private</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-4 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {loading ? (
            <div>
              <div className="text-5xl mb-4">🔬</div>
              <p className="text-xl font-semibold text-blue-600">Running clinical analysis...</p>
              <p className="text-gray-500 mt-2">Checking drugs, interactions, lab values</p>
              <div className="mt-4 bg-blue-100 rounded-full h-2 w-48 mx-auto overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl font-semibold text-gray-700">Upload Medical Document</p>
              <p className="text-gray-500 mt-2">Prescription • Lab Report • Discharge Summary</p>
              <p className="text-sm text-gray-400 mt-3">JPG, PNG, PDF supported</p>
              <div className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full inline-block text-sm font-medium">
                Choose File
              </div>
            </div>
          )}
        </div>

        <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

        <button
          onClick={() => router.push('/chat')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex items-center justify-between mb-6 hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">👨‍⚕️</div>
            <div className="text-left">
              <p className="font-bold text-lg">Ask Dr. MedicalPlain</p>
              <p className="text-blue-100 text-sm">MBBS AI • Drugs • Symptoms • Lab help</p>
            </div>
          </div>
          <span className="text-2xl">→</span>
        </button>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: '💊', title: 'Drug Analysis', desc: 'Full risk profile, interactions, timing' },
            { icon: '🔬', title: 'Lab Interpretation', desc: 'What every value means clinically' },
            { icon: '⚠️', title: 'Risk Scoring', desc: 'Side effect risk percentages' },
            { icon: '❓', title: 'Doctor Questions', desc: '5 questions to ask your doctor' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          MedicalPlain is for educational purposes only. Always consult a qualified doctor for medical decisions.
        </p>
      </div>
    </main>
  );
}

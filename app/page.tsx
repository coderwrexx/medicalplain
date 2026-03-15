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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            MedicalPlain
          </h1>
          <p className="text-xl text-gray-600">
            Upload your prescription or lab report.<br/>
            Get a plain English explanation in 30 seconds.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Free. No signup required. 100% private.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {loading ? (
            <div>
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-xl font-semibold text-blue-600">
                Analyzing your document...
              </p>
              <p className="text-gray-500 mt-2">This takes about 30 seconds</p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl font-semibold text-gray-700">
                Drop your document here
              </p>
              <p className="text-gray-500 mt-2">
                or click to upload
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Supports: JPG, PNG, PDF — Prescriptions, Lab Reports, Discharge Summaries
              </p>
            </div>
          )}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">💊</div>
            <p className="text-sm text-gray-600">Explains every medication</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🔬</div>
            <p className="text-sm text-gray-600">Flags abnormal lab values</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">❓</div>
            <p className="text-sm text-gray-600">Questions to ask your doctor</p>
          </div>
        </div>

      </div>
    </main>
  );
}

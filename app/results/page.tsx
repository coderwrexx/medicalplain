'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Results() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('analysisResult');
    if (!stored) { router.push('/'); return; }
    setData(JSON.parse(stored));
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => router.push('/')}
          className="mb-6 text-blue-600 hover:underline text-sm"
        >
          ← Analyze another document
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Results
        </h1>
        <p className="text-gray-600 mb-8">{data.summary}</p>

        {/* Red Flags */}
        {data.redFlags?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-red-700 mb-3">
              🚨 Red Flags — Contact Your Doctor
            </h2>
            <ul className="space-y-2">
              {data.redFlags.map((flag: string, i: number) => (
                <li key={i} className="text-red-600 flex items-start gap-2">
                  <span>•</span><span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medications */}
        {data.medications?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              💊 Your Medications
            </h2>
            <div className="space-y-4">
              {data.medications.map((med: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {med.name}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Purpose: </span>
                    {med.purpose}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    <span className="font-semibold">Side effects: </span>
                    {med.sideEffects?.join(', ')}
                  </p>
                  {med.importantNote && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ {med.importantNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab Values */}
        {data.labValues?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔬 Your Lab Results
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {data.labValues.map((lab: any, i: number) => (
                <div key={i} className={`p-4 flex items-start gap-4 ${
                  i !== 0 ? 'border-t border-gray-100' : ''
                }`}>
                  <span className={`mt-1 px-2 py-1 rounded-lg text-xs font-bold ${
                    lab.status === 'normal'
                      ? 'bg-green-100 text-green-700'
                      : lab.status === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {lab.status?.toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-gray-900">
                        {lab.testName}
                      </p>
                      <p className="text-gray-700 font-mono">{lab.value}</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {lab.plainExplanation}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Normal range: {lab.normalRange}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions to Ask */}
        {data.questionsToAsk?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ❓ Questions to Ask Your Doctor
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              {data.questionsToAsk.map((q: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-700">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-sm">{data.disclaimer}</p>
        </div>

        {/* Share Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const text = `I used MedicalPlain to understand my medical document. Try it free at medicalplain.com`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            📱 Share on WhatsApp
          </button>
        </div>

      </div>
    </main>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryEntry {
  id: string;
  date: string;
  documentType: string;
  summary: string;
  riskScore: string;
  data: any;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('medHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clear = () => {
    if (confirm('Delete all history?')) {
      localStorage.removeItem('medHistory');
      setHistory([]);
    }
  };

  const riskColor = (risk: string) => {
    if (!risk) return 'bg-gray-100 text-gray-700';
    if (risk.toLowerCase() === 'low') return 'bg-green-100 text-green-700';
    if (risk.toLowerCase() === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (history.length === 0) return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">📋 Health History</h1>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-600 font-medium">No history yet</p>
          <p className="text-gray-400 text-sm mt-1">Your analyzed documents will appear here</p>
          <button onClick={() => router.push('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold">
            Analyze a document
          </button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">📋 Health History</h1>
          <button onClick={clear} className="ml-auto text-red-400 text-sm hover:text-red-600">Clear all</button>
        </div>

        <div className="space-y-3">
          {history.map(entry => (
            <div key={entry.id} onClick={() => {
              localStorage.setItem('analysisResult', JSON.stringify(entry.data));
              router.push('/results');
            }} className="bg-white rounded-2xl p-4 shadow-sm border cursor-pointer hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 capitalize">{entry.documentType?.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{entry.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">{entry.date}</p>
                </div>
                {entry.riskScore && (
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ml-3 flex-shrink-0 ${riskColor(entry.riskScore)}`}>
                    {entry.riskScore.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

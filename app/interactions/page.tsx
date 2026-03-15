'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DrugInteractions() {
  const [drugs, setDrugs] = useState(['', '']);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addDrug = () => setDrugs([...drugs, '']);
  const updateDrug = (i: number, val: string) => {
    const updated = [...drugs];
    updated[i] = val;
    setDrugs(updated);
  };
  const removeDrug = (i: number) => setDrugs(drugs.filter((_, idx) => idx !== i));

  const check = async () => {
    const validDrugs = drugs.filter(d => d.trim());
    if (validDrugs.length < 2) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Check drug interactions for these medications: ${validDrugs.join(', ')}

As an experienced clinical pharmacologist, provide:
1. Interaction severity (None/Mild/Moderate/Severe/Contraindicated)
2. Specific interactions between each pair
3. Clinical effects of each interaction
4. Risk percentage
5. What to monitor
6. Safe alternatives if needed
7. Recommendation (Safe to take together / Take with caution / Avoid combination)

Be specific and detailed.`
          }]
        }),
      });
      const data = await res.json();
      setResult(data.reply);
    } catch {
      setResult('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">🔄 Drug Interaction Checker</h1>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border mb-4">
          <p className="text-sm text-gray-600 mb-4">Enter 2 or more medicines to check if they are safe to take together.</p>
          {drugs.map((drug, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <input value={drug} onChange={e => updateDrug(i, e.target.value)}
                placeholder={`Medicine ${i + 1} (e.g. Metformin 500mg)`}
                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
              {drugs.length > 2 && (
                <button onClick={() => removeDrug(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
              )}
            </div>
          ))}
          <button onClick={addDrug} className="text-blue-600 text-sm mb-4 hover:underline">+ Add another medicine</button>
          <button onClick={check} disabled={loading || drugs.filter(d => d.trim()).length < 2}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
            {loading ? '🔍 Checking interactions...' : '🔄 Check Interactions'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🔬 Interaction Analysis</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-yellow-800 text-xs">⚠️ Always consult your doctor or pharmacist before combining medications.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

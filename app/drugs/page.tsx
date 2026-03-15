'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DrugDatabase() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const commonDrugs = ['Paracetamol', 'Metformin', 'Aspirin', 'Atorvastatin', 'Amlodipine', 'Omeprazole', 'Amoxicillin', 'Cetirizine', 'Pantoprazole', 'Ibuprofen', 'Azithromycin', 'Losartan'];

  const search = async (drug: string) => {
    if (!drug.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Give me a complete medical reference for: ${drug}

Include:
1. Full drug name and generic name
2. Drug class and mechanism of action
3. All approved uses/indications
4. Dosage (adult, elderly, children)
5. Side effects (common %, serious %, rare %)
6. Contraindications (who should NOT take it)
7. Drug interactions (list specific drugs)
8. Food interactions
9. Pregnancy and breastfeeding safety
10. Overdose symptoms and treatment
11. Addiction/dependence risk
12. How to take it (with/without food, time of day)
13. What to do if you miss a dose
14. Storage instructions
15. Cost and availability in India

Be comprehensive and use simple language.`
          }]
        }),
      });
      const data = await res.json();
      setResult(data.reply);
    } catch { setResult('Something went wrong.'); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">💊 Drug Database</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4">
          <div className="flex gap-2 mb-3">
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search(query)}
              placeholder="Search any medicine... (e.g. Metformin)"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
            <button onClick={() => search(query)} disabled={loading || !query.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
              Search
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Common medicines:</p>
          <div className="flex flex-wrap gap-2">
            {commonDrugs.map(d => (
              <button key={d} onClick={() => { setQuery(d); search(d); }}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100">
                {d}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border">
            <div className="text-4xl mb-2">🔬</div>
            <p className="text-blue-600 font-semibold">Searching drug database...</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-900 mb-3 text-lg">📋 {query}</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
            <a href={`https://www.netmeds.com/products?q=${encodeURIComponent(query)}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-4 block text-center bg-green-600 text-white py-2 rounded-xl text-sm font-semibold">
              💊 Buy {query} on Netmeds →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

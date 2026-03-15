'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Nutrition() {
  const [food, setFood] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const quickFoods = ['Rice (1 cup)', 'Roti (2)', 'Dal (1 bowl)', 'Chicken curry', 'Idli (3)', 'Dosa', 'Sambar', 'Curd rice', 'Banana', 'Apple', 'Egg (1)', 'Milk (1 glass)'];

  const analyze = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze the nutrition for: ${food}

Provide:
1. Calories (kcal)
2. Macronutrients: Protein (g), Carbohydrates (g), Fats (g), Fiber (g)
3. Key vitamins and minerals
4. Glycemic index
5. Health benefits
6. Who should eat more of this
7. Who should limit or avoid this
8. Best time to eat
9. Healthier alternatives
10. How it affects blood sugar, cholesterol, weight

Use Indian food portions and context. Be specific with numbers.`
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
          <h1 className="text-2xl font-bold text-gray-900">🍎 Nutrition Analyzer</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4">
          <div className="flex gap-2 mb-3">
            <input value={food} onChange={e => setFood(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter any food... (e.g. 2 rotis with dal)"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"/>
            <button onClick={analyze} disabled={loading || !food.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
              Analyze
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {quickFoods.map(f => (
              <button key={f} onClick={() => { setFood(f); analyze(); }}
                className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="bg-white rounded-2xl p-6 text-center shadow-sm border"><div className="text-4xl mb-2">🔬</div><p className="text-green-600 font-semibold">Analyzing nutrition...</p></div>}

        {result && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-900 mb-3">🍽️ {food}</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}

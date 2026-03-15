'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Nutrition() {
  const [food, setFood] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const router = useRouter();

  const quickFoods = ['Rice (1 cup)', 'Roti (2)', 'Dal (1 bowl)', 'Chicken curry', 'Idli (3)', 'Dosa (1)', 'Banana', 'Apple', 'Egg (1)', 'Milk (1 glass)', 'Curd (1 bowl)', 'Paneer (100g)'];

  const nutritionGuide = [
    { nutrient: 'Proteins', role: 'Build and repair muscles, make enzymes and hormones', sources: 'Eggs, dal, chicken, fish, paneer, soybean, milk', daily: '50-60g/day', deficiency: 'Muscle loss, weak immunity, hair fall', icon: '💪' },
    { nutrient: 'Carbohydrates', role: 'Main energy source for brain and body', sources: 'Rice, roti, bread, potato, fruits, oats', daily: '225-325g/day', deficiency: 'Fatigue, poor concentration, dizziness', icon: '⚡' },
    { nutrient: 'Fats', role: 'Brain function, hormone production, vitamin absorption', sources: 'Ghee, nuts, avocado, coconut oil, fish', daily: '44-77g/day', deficiency: 'Dry skin, hormone imbalance, poor brain function', icon: '🫀' },
    { nutrient: 'Fiber', role: 'Digestive health, blood sugar control, heart health', sources: 'Vegetables, fruits, whole grains, legumes', daily: '25-38g/day', deficiency: 'Constipation, high blood sugar, high cholesterol', icon: '🌿' },
    { nutrient: 'Vitamin C', role: 'Immunity, skin health, iron absorption, antioxidant', sources: 'Amla, guava, lemon, orange, capsicum', daily: '65-90mg/day', deficiency: 'Scurvy, slow wound healing, frequent infections', icon: '🍊' },
    { nutrient: 'Vitamin D', role: 'Bone strength, immunity, mood regulation', sources: 'Sunlight, fish, egg yolk, fortified milk', daily: '600-800 IU/day', deficiency: 'Weak bones, rickets, depression, frequent illness', icon: '☀️' },
    { nutrient: 'Vitamin B12', role: 'Nerve function, red blood cell formation, DNA', sources: 'Meat, fish, eggs, dairy — vegetarians at high risk!', daily: '2.4mcg/day', deficiency: 'Anemia, nerve damage, memory loss, fatigue', icon: '🧠' },
    { nutrient: 'Iron', role: 'Oxygen transport in blood, energy, brain function', sources: 'Spinach, dal, red meat, jaggery, sesame seeds', daily: '8-18mg/day', deficiency: 'Anemia, extreme fatigue, pale skin, breathlessness', icon: '🩸' },
    { nutrient: 'Calcium', role: 'Bone and teeth strength, muscle contraction, nerves', sources: 'Milk, curd, paneer, ragi, sesame seeds, tofu', daily: '1000-1200mg/day', deficiency: 'Weak bones, osteoporosis, muscle cramps, dental issues', icon: '🦴' },
    { nutrient: 'Magnesium', role: 'Muscle function, sleep quality, heart rhythm, nerves', sources: 'Nuts, seeds, dark chocolate, green vegetables, banana', daily: '310-420mg/day', deficiency: 'Muscle cramps, insomnia, anxiety, high blood pressure', icon: '😴' },
    { nutrient: 'Zinc', role: 'Immune function, wound healing, taste and smell', sources: 'Pumpkin seeds, chickpeas, meat, nuts, whole grains', daily: '8-11mg/day', deficiency: 'Poor immunity, slow healing, hair loss, loss of taste', icon: '🛡️' },
    { nutrient: 'Potassium', role: 'Heart rhythm, blood pressure control, muscle function', sources: 'Banana, potato, tomato, coconut water, dal', daily: '2600-3400mg/day', deficiency: 'Muscle weakness, high BP, irregular heartbeat, fatigue', icon: '❤️' },
    { nutrient: 'Omega-3', role: 'Heart health, brain function, anti-inflammation', sources: 'Fish (salmon, sardines), flaxseeds, walnuts, chia seeds', daily: '1.1-1.6g/day', deficiency: 'Dry skin, poor memory, depression, joint pain', icon: '🐟' },
    { nutrient: 'Folate (B9)', role: 'Cell growth, DNA repair — critical in pregnancy', sources: 'Dark leafy greens, dal, avocado, citrus, fortified foods', daily: '400-600mcg/day', deficiency: 'Anemia, birth defects in pregnancy, mouth sores', icon: '🤰' },
  ];

  const analyze = async (f?: string) => {
    const target = f || food;
    if (!target.trim()) return;
    setShowGuide(false);
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze the nutrition for: ${target}

Provide a DETAILED but CONCISE nutritional analysis:

**Calories & Macros:**
- Calories: X kcal | Protein: Xg | Carbs: Xg | Fat: Xg | Fiber: Xg

**Key Nutrients Present:**
- [List top 5 vitamins/minerals with amounts]

**Glycemic Index:** X (Low/Medium/High)

**Health Benefits:** [2-3 specific benefits]

**Who benefits most:** [Specific groups]

**Who should limit:** [Specific conditions to be careful]

**Best time to eat:** Morning/afternoon/evening — why

**Healthier alternatives:** [2 options]

**Indian context:** How this fits into typical Indian diet

Use Indian portion sizes. Be specific with numbers. Keep each section to 1-2 lines.`
          }]
        }),
      });
      const data = await res.json();
      setResult(data.reply);
    } catch { setResult('Something went wrong.'); }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '16px' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>🍎 Nutrition AI</h1>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input value={food} onChange={e => setFood(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter any food (e.g. 2 rotis with dal)"
              style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}/>
            <button onClick={() => analyze()} disabled={loading || !food.trim()}
              style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', opacity: loading || !food.trim() ? 0.5 : 1 }}>
              Analyze
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickFoods.map(f => (
              <button key={f} onClick={() => { setFood(f); analyze(f); }}
                style={{ fontSize: '12px', backgroundColor: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '20px', border: '1px solid #86efac', cursor: 'pointer' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '16px' }}><div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div><p style={{ color: '#16a34a', fontWeight: '600', margin: 0 }}>Analyzing nutrition...</p></div>}

        {result && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>🍽️ {food}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{result}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>📚 Nutrition Guide</h2>
          <button onClick={() => setShowGuide(!showGuide)} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>{showGuide ? 'Hide' : 'Show'}</button>
        </div>

        {showGuide && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '14px 16px' }}>
              <p style={{ color: 'white', fontWeight: '700', margin: '0 0 2px 0', fontSize: '14px' }}>Complete Nutrition Reference</p>
              <p style={{ color: '#bfdbfe', fontSize: '12px', margin: 0 }}>What every nutrient does, where to get it, and signs of deficiency</p>
            </div>
            {nutritionGuide.map((n, i) => (
              <div key={i} style={{ padding: '14px 16px', borderTop: i !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{n.icon}</span>
                  <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontSize: '14px' }}>{n.nutrient}</p>
                  <span style={{ marginLeft: 'auto', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>{n.daily}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>📌 <strong>Role:</strong> {n.role}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>🥗 <strong>Sources:</strong> {n.sources}</p>
                  <p style={{ fontSize: '12px', color: '#b91c1c', margin: 0 }}>⚠️ <strong>Deficiency:</strong> {n.deficiency}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

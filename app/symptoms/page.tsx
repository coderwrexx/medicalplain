'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const commonSymptoms = [
    'Headache', 'Fever', 'Chest pain', 'Shortness of breath',
    'Nausea', 'Fatigue', 'Dizziness', 'Back pain',
    'Stomach pain', 'Cough', 'Joint pain', 'Rash'
  ];

  const check = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Patient: ${age ? age + ' years old' : ''} ${gender || ''}
Symptoms: ${symptoms}

As an experienced MBBS doctor, provide a detailed analysis:
1. Most likely conditions (with probability %)
2. Red flag symptoms to watch for
3. Recommended tests
4. Home remedies that may help
5. When to see a doctor urgently
6. Specialist to consult

Be detailed, caring, and use simple language.`
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
          <h1 className="text-2xl font-bold text-gray-900">🩺 Symptom Checker</h1>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border mb-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">AGE</label>
              <input value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 35"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">GENDER</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <label className="text-xs font-semibold text-gray-600 mb-2 block">COMMON SYMPTOMS — tap to add:</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {commonSymptoms.map(s => (
              <button key={s} onClick={() => setSymptoms(prev => prev ? prev + ', ' + s : s)}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100">
                {s}
              </button>
            ))}
          </div>

          <label className="text-xs font-semibold text-gray-600 mb-1 block">DESCRIBE YOUR SYMPTOMS IN DETAIL:</label>
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
            placeholder="e.g. I have had a severe headache for 3 days, mostly on the right side, with nausea and sensitivity to light..."
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 h-28 resize-none mb-4"/>

          <button onClick={check} disabled={loading || !symptoms.trim()}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
            {loading ? '🔍 Analyzing symptoms...' : '🩺 Check My Symptoms'}
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-4xl mb-3">🔬</div>
            <p className="text-blue-600 font-semibold">Dr. MedicalPlain is analyzing...</p>
            <p className="text-gray-500 text-sm mt-1">Checking possible conditions</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🩺 Clinical Assessment</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-xs font-semibold">⚠️ IMPORTANT: This is AI-generated information for educational purposes only. Always consult a qualified doctor for proper diagnosis and treatment.</p>
            </div>
            <button onClick={() => router.push('/chat')}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold">
              💬 Discuss further with Dr. MedicalPlain
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

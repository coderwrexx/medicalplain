'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MentalHealth() {
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('phq9');
  const router = useRouter();

  const phq9 = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure',
    'Trouble concentrating on things',
    'Moving or speaking slowly — or being fidgety/restless',
    'Thoughts that you would be better off dead or of hurting yourself',
  ];

  const options = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

  const getScore = () => answers.reduce((sum, a) => sum + (a === -1 ? 0 : a), 0);

  const getSeverity = (score: number) => {
    if (score <= 4) return { label: 'Minimal/None', color: 'text-green-600', action: 'No treatment likely needed' };
    if (score <= 9) return { label: 'Mild', color: 'text-yellow-600', action: 'Watchful waiting, repeat assessment' };
    if (score <= 14) return { label: 'Moderate', color: 'text-orange-600', action: 'Treatment plan recommended' };
    if (score <= 19) return { label: 'Moderately Severe', color: 'text-red-500', action: 'Active treatment recommended' };
    return { label: 'Severe', color: 'text-red-700', action: 'Immediate treatment required' };
  };

  const analyze = async () => {
    if (answers.some(a => a === -1)) { alert('Please answer all questions'); return; }
    setLoading(true);
    const score = getScore();
    const severity = getSeverity(score);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `PHQ-9 Depression Screening Results:
Score: ${score}/27
Severity: ${severity.label}
Answers: ${phq9.map((q, i) => `${q}: ${options[answers[i]]}`).join(', ')}

As a psychiatrist, provide:
1. What this score means
2. Likely diagnosis (if any)
3. Immediate self-help strategies
4. Professional treatment options
5. When to seek emergency help
6. Lifestyle changes that help
7. Supportive resources in India

Be compassionate, detailed, and non-judgmental.`
          }]
        }),
      });
      const data = await res.json();
      setResult(data.reply);
    } catch { setResult('Something went wrong.'); }
    setLoading(false);
  };

  const score = getScore();
  const severity = getSeverity(score);
  const answered = answers.filter(a => a !== -1).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-4">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">🧠 Mental Health</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <p className="text-blue-800 text-sm">This is the PHQ-9, a clinically validated depression screening tool used by doctors worldwide. Answer honestly — your responses are private.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Over the last 2 weeks, how often have you been bothered by:</h2>
          </div>
          <div className="space-y-4">
            {phq9.map((q, i) => (
              <div key={i} className={`p-3 rounded-xl ${answers[i] === -1 ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <p className="text-sm font-medium text-gray-800 mb-2">{i+1}. {q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((opt, j) => (
                    <button key={j} onClick={() => {
                      const updated = [...answers];
                      updated[i] = j;
                      setAnswers(updated);
                    }} className={`text-xs py-1.5 px-2 rounded-lg border transition-all ${answers[i] === j ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {opt} ({j})
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {answered > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">Score so far: <span className="font-bold text-gray-900">{score}</span> • {answered}/9 answered</p>
              {answered === 9 && <p className={`font-bold ${severity.color} mt-1`}>{severity.label}</p>}
            </div>
          )}

          <button onClick={analyze} disabled={loading || answered < 9}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
            {loading ? '🧠 Analyzing...' : answered < 9 ? `Answer all questions (${answered}/9)` : 'Get Clinical Assessment'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border mb-4">
            <h2 className="font-bold text-gray-900 mb-1">🧠 Clinical Assessment</h2>
            <p className={`font-bold text-lg mb-3 ${severity.color}`}>{severity.label} Depression (Score: {score}/27)</p>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
            {score >= 15 && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-red-700 font-bold text-sm">⚠️ Please seek professional help</p>
                <a href="https://www.practo.com/search/doctors?specialization=Psychiatrist" target="_blank" rel="noopener noreferrer"
                  className="block mt-2 bg-red-600 text-white text-center py-2 rounded-xl text-sm font-semibold">
                  Find a Psychiatrist on Practo →
                </a>
              </div>
            )}
            <div className="mt-3 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">iCall (TISS): 9152987821 • Vandrevala Foundation: 1860-2662-345 • NIMHANS: 080-46110007</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecondOpinion() {
  const [question, setQuestion] = useState('');
  const [opinions, setOpinions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const specialists = [
    { role: 'General Physician', emoji: '👨‍⚕️', focus: 'overall health assessment and treatment plan' },
    { role: 'Specialist Doctor', emoji: '🔬', focus: 'specific organ system and specialized diagnosis' },
    { role: 'Clinical Pharmacist', emoji: '💊', focus: 'medications, interactions, and drug safety' },
  ];

  const getOpinions = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setOpinions([]);
    try {
      const results = await Promise.all(
        specialists.map(async (spec) => {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: `As a ${spec.role} focusing on ${spec.focus}, give your professional opinion on: ${question}\n\nProvide a concise but complete answer from your specialty perspective.` }]
            }),
          });
          const data = await res.json();
          return { ...spec, opinion: data.reply };
        })
      );
      setOpinions(results);
    } catch { setOpinions(specialists.map(s => ({ ...s, opinion: 'Failed to get opinion.' }))); }
    setLoading(false);
  };

  const examples = ['My HbA1c is 8.2 and I am on Metformin 500mg. Should I change medication?', 'I have chest pain when climbing stairs. What could it be?', 'My creatinine is 1.8 mg/dL. Is this serious?'];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>🔍 Second Opinion</h1>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Get 3 different specialist perspectives simultaneously.</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Examples:</p>
          {examples.map((e, i) => (
            <button key={i} onClick={() => setQuestion(e)}
              style={{ display: 'block', width: '100%', textAlign: 'left', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '8px 12px', marginBottom: '6px', fontSize: '12px', color: '#1e40af', cursor: 'pointer' }}>
              {e}
            </button>
          ))}
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="Describe your medical question or situation in detail..."
            style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', fontSize: '14px', height: '100px', resize: 'none', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: '12px', boxSizing: 'border-box' }}/>
          <button onClick={getOpinions} disabled={loading || !question.trim()}
            style={{ width: '100%', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: loading || !question.trim() ? 0.5 : 1 }}>
            {loading ? '🔍 Getting 3 opinions...' : '🔍 Get 3 Specialist Opinions'}
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {specialists.map((s, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{s.emoji}</span>
                  <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{s.role}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', height: '12px', width: '100%' }}/>
                  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', height: '12px', width: '80%' }}/>
                  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', height: '12px', width: '60%' }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {opinions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>3 Expert Perspectives:</h2>
            {opinions.map((op, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{op.emoji}</span>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{op.role}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{op.focus}</p>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{op.opinion}</div>
              </div>
            ))}
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '14px', padding: '12px', marginBottom: '80px' }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>⚕️ AI opinions for educational purposes only. Always consult a licensed doctor.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Trends() {
  const [history, setHistory] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const h = localStorage.getItem('medHistory');
    if (h) setHistory(JSON.parse(h));
  }, []);

  const analyze = async () => {
    if (history.length < 2) { alert('You need at least 2 past analyses to see trends.'); return; }
    setLoading(true);
    const summaries = history.slice(0, 10).map((h, i) => `Report ${i+1} (${h.date}): ${h.summary} | Risk: ${h.riskScore}`).join('\n');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze these medical reports over time and identify health trends:\n\n${summaries}\n\nProvide: 1) Overall health trajectory 2) Specific trends 3) Early warning signs 4) Predicted risks 5) Urgent actions 6) Positive improvements 7) Prevention plan. Be specific and actionable.` }]
        }),
      });
      const data = await res.json();
      setAnalysis(data.reply);
    } catch { setAnalysis('Analysis failed.'); }
    setLoading(false);
  };

  const riskColor = (r: string) => r === 'low' ? '#22c55e' : r === 'medium' ? '#f59e0b' : '#ef4444';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>📈 Health Trends</h1>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>AI analysis of your health over time — {history.length} report{history.length !== 1 ? 's' : ''} found</p>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0' }}>No history yet. Analyze documents first.</p>
              <button onClick={() => router.push('/')} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Analyze a Document</button>
            </div>
          ) : (
            <>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < Math.min(history.length, 5) - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: riskColor(h.riskScore), flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 2px 0', textTransform: 'capitalize' }}>{h.documentType?.replace('_', ' ')}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{h.date}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', backgroundColor: h.riskScore === 'low' ? '#dcfce7' : h.riskScore === 'medium' ? '#fef9c3' : '#fee2e2', color: riskColor(h.riskScore) }}>
                    {(h.riskScore || 'unknown').toUpperCase()}
                  </span>
                </div>
              ))}
              <button onClick={analyze} disabled={loading || history.length < 2}
                style={{ width: '100%', marginTop: '16px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: loading || history.length < 2 ? 0.5 : 1 }}>
                {loading ? '🔍 Analyzing patterns...' : history.length < 2 ? 'Need 2+ reports for trends' : '📈 Analyze My Health Trends'}
              </button>
            </>
          )}
        </div>

        {analysis && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '80px' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>📈 Trend Analysis</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{analysis}</div>
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanCondition() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');
  const [scanType, setScanType] = useState('skin');
  const router = useRouter();

  const scanTypes = [
    { id: 'skin', label: '🔴 Skin/Rash', desc: 'Rash, wound, mole, acne' },
    { id: 'eye', label: '👁️ Eye', desc: 'Redness, discharge, swelling' },
    { id: 'tongue', label: '👅 Tongue', desc: 'Color, coating, sores' },
    { id: 'nail', label: '💅 Nail', desc: 'Color, texture changes' },
    { id: 'wound', label: '🩹 Wound', desc: 'Cut, burn, bruise' },
    { id: 'xray', label: '🫁 X-Ray/Scan', desc: 'Medical imaging' },
  ];

  const analyze = async (file: File) => {
    setLoading(true);
    setResult('');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setPreview(e.target?.result as string);
      const mimeType = file.type || 'image/jpeg';
      try {
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType, scanType }),
        });
        const data = await res.json();
        setResult(data.result);
      } catch { setResult('Analysis failed. Please try again.'); }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>📸 Visual AI Diagnosis</h1>
        </div>

        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '16px', padding: '12px 16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>📸 Take a clear, well-lit photo. The AI analyzes it like a doctor examining in person.</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>What are you scanning?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {scanTypes.map(s => (
              <button key={s.id} onClick={() => setScanType(s.id)} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${scanType === s.id ? '#2563eb' : 'var(--border-color)'}`, backgroundColor: scanType === s.id ? '#eff6ff' : 'var(--bg-secondary)', textAlign: 'left', cursor: 'pointer' }}>
                <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{s.label}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{s.desc}</p>
              </button>
            ))}
          </div>

          <div onClick={() => document.getElementById('scanInput')?.click()}
            style={{ border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)' }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '12px', objectFit: 'contain', display: 'block' }}/>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📸</div>
                <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Take or upload a photo</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Camera or gallery</p>
              </div>
            )}
          </div>
          <input id="scanInput" type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) analyze(f); }}/>
        </div>

        {loading && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '32px', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
            <p style={{ color: '#2563eb', fontWeight: '600', margin: '0 0 4px 0' }}>AI is examining the photo...</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Analyzing visual patterns</p>
          </div>
        )}

        {result && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>🔬 Visual Analysis</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{result}</div>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px', marginTop: '16px' }}>
              <p style={{ fontSize: '12px', color: '#991b1b', margin: 0 }}>⚠️ AI analysis only. A doctor must confirm any diagnosis.</p>
            </div>
            <a href="https://www.practo.com/consult/direct/new_consultation" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '14px', fontWeight: '600', textDecoration: 'none', marginTop: '12px', fontSize: '14px' }}>
              Book a Specialist on Practo →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

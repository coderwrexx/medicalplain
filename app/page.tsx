'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const h = localStorage.getItem('medHistory');
    const r = localStorage.getItem('medReminders');
    if (h) setHistoryCount(JSON.parse(h).length);
    if (r) setReminderCount(JSON.parse(r).filter((x: any) => x.active).length);
  }, []);

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const mimeType = file.type || 'image/jpeg';
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        });
        const data = await response.json();
        localStorage.setItem('analysisResult', JSON.stringify(data));
        const history = JSON.parse(localStorage.getItem('medHistory') || '[]');
        history.unshift({ id: Date.now().toString(), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), documentType: data.documentType || 'document', summary: data.summary || '', riskScore: data.overallRiskScore || '', data });
        localStorage.setItem('medHistory', JSON.stringify(history.slice(0, 20)));
        router.push('/results');
      } catch { alert('Something went wrong. Please try again.'); setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const tools = [
    { icon: '👨‍⚕️', title: 'Ask Doctor', desc: 'Voice + text AI doctor', path: '/chat', color: '#2563eb' },
    { icon: '🩺', title: 'Symptom Check', desc: 'Identify conditions', path: '/symptoms', color: '#16a34a' },
    { icon: '📸', title: 'Photo Diagnosis', desc: 'Scan skin, eye, wound', path: '/scan', color: '#db2777' },
    { icon: '🔍', title: 'Second Opinion', desc: '3 specialist views', path: '/secondopinion', color: '#7c3aed' },
    { icon: '🔄', title: 'Drug Interactions', desc: 'Check drug safety', path: '/interactions', color: '#ea580c' },
    { icon: '💊', title: 'Drug Database', desc: 'Any medicine info', path: '/drugs', color: '#9333ea' },
    { icon: '📊', title: 'Health Dashboard', desc: 'BMI, BP, sugar score', path: '/dashboard', color: '#0891b2' },
    { icon: '📈', title: 'Health Trends', desc: 'Pattern detection', path: '/trends', color: '#0e7490' },
    { icon: '🧠', title: 'Mental Health', desc: 'PHQ-9 screening', path: '/mental', color: '#4338ca' },
    { icon: '🍎', title: 'Nutrition AI', desc: 'Analyze any food', path: '/nutrition', color: '#65a30d' },
    { icon: '⏰', title: 'Med Reminders', desc: reminderCount > 0 ? `${reminderCount} active` : 'Never miss dose', path: '/reminders', color: '#dc2626' },
    { icon: '📋', title: 'Health History', desc: historyCount > 0 ? `${historyCount} records` : 'Past analyses', path: '/history', color: '#4b5563' },
    { icon: '📤', title: 'Share Report', desc: 'Beautiful report card', path: '/share', color: '#059669' },
    { icon: '🚨', title: 'Emergency', desc: '108 + First Aid', path: '/emergency', color: '#b91c1c' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>

        <div style={{ textAlign: 'center', paddingTop: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#2563eb', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>
            🏆 World's Best Free Medical AI
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>MedicalPlain</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>Your complete personal medical AI — smarter than any app, completely free</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>✅ Free forever</span><span>✅ MBBS-level AI</span><span>✅ Voice + Photo</span><span>✅ 14 health tools</span>
          </div>
        </div>

        <div
          onClick={() => document.getElementById('fileInput')?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          style={{ border: `2px dashed ${dragOver ? '#2563eb' : 'var(--border-color)'}`, borderRadius: '20px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', backgroundColor: dragOver ? '#eff6ff' : 'var(--bg-card)', marginBottom: '16px', transition: 'all 0.2s' }}>
          {loading ? (
            <div>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
              <p style={{ fontWeight: '600', color: '#2563eb', margin: '0 0 4px 0' }}>Running clinical analysis...</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Checking drugs, interactions, risk scores</p>
              <div style={{ marginTop: '12px', backgroundColor: '#dbeafe', borderRadius: '8px', height: '6px', width: '160px', margin: '12px auto 0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '75%', backgroundColor: '#2563eb', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}/>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📋</div>
              <p style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Upload Medical Document</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Prescription • Lab Report • Discharge Summary</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>JPG • PNG • PDF</p>
              <span style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 24px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Choose File</span>
            </div>
          )}
        </div>

        <input id="fileInput" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {tools.map((t, i) => (
            <button key={i} onClick={() => router.push(t.path)}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '16px', textAlign: 'left', cursor: 'pointer', position: 'relative', boxShadow: 'var(--shadow)', transition: 'all 0.2s' }}>
              {(t.path === '/reminders' && reminderCount > 0) || (t.path === '/history' && historyCount > 0) ? (
                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dc2626', color: 'white', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  {t.path === '/reminders' ? reminderCount : historyCount}
                </span>
              ) : null}
              <div style={{ width: '42px', height: '42px', backgroundColor: t.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>
                {t.icon}
              </div>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', margin: '0 0 3px 0' }}>{t.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{t.desc}</p>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #86efac', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🩺</span>
              <div><p style={{ fontWeight: '700', color: '#166534', fontSize: '14px', margin: '0 0 2px 0' }}>Book a real doctor</p><p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>Practo — trusted by 20M patients</p></div>
            </div>
            <a href="https://www.practo.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '12px', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>Book →</a>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #93c5fd', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🛡️</span>
              <div><p style={{ fontWeight: '700', color: '#1e40af', fontSize: '14px', margin: '0 0 2px 0' }}>Health Insurance</p><p style={{ fontSize: '12px', color: '#2563eb', margin: 0 }}>InsuranceDekho — free comparison</p></div>
            </div>
            <a href="https://www.insurancedekho.com/health-insurance" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#2563eb', color: 'white', fontSize: '12px', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>Quote →</a>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #fca5a5', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🚨</span>
              <div><p style={{ fontWeight: '700', color: '#991b1b', fontSize: '14px', margin: '0 0 2px 0' }}>Medical Emergency</p><p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>Ambulance 108 • First Aid guide</p></div>
            </div>
            <button onClick={() => router.push('/emergency')} style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '12px', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>SOS →</button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', paddingBottom: '100px' }}>
          Educational purposes only. Always consult a doctor. Emergency: 112
        </p>
      </div>
    </main>
  );
}

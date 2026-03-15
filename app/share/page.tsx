'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShareCard() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('analysisResult');
    if (stored) setData(JSON.parse(stored));
  }, []);

  const shareToWhatsApp = () => {
    if (!data) return;
    const text = `🏥 MedicalPlain Health Report\n\n📋 ${(data?.documentType || 'Document').replace('_', ' ').toUpperCase()}\n\n${data?.summary}\n\n⚕️ Risk Level: ${(data?.overallRiskScore || 'ASSESSED').toUpperCase()}\n\n🔗 Get your free analysis at medicalplain.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  if (!data) return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No report to share yet</p>
        <button onClick={() => router.push('/')} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          Analyze a Document
        </button>
      </div>
    </main>
  );

  const riskBg = (r: string) => !r ? '#f3f4f6' : r === 'low' ? '#dcfce7' : r === 'medium' ? '#fef9c3' : '#fee2e2';
  const riskText = (r: string) => !r ? '#374151' : r === 'low' ? '#166534' : r === 'medium' ? '#713f12' : '#991b1b';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '16px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/results')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>📤 Share Report</h1>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 10px 40px rgba(37,99,235,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px', color: 'white' }}>M</div>
            <div>
              <p style={{ fontWeight: '700', color: 'white', fontSize: '16px', margin: 0 }}>MedicalPlain</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>AI Health Analysis</p>
            </div>
            <p style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{new Date().toLocaleDateString()}</p>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>{(data.documentType || 'document').replace('_', ' ')}</p>
            <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{data.summary?.slice(0, 150)}...</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', margin: '0 0 4px 0' }}>💊</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{data.medications?.filter((m: any) => m.name).length || 0} Meds</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', margin: '0 0 4px 0' }}>🔬</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{data.labValues?.filter((l: any) => l.testName).length || 0} Tests</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', margin: '0 0 4px 0' }}>⚕️</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{(data.overallRiskScore || 'LOW').toUpperCase()}</p>
            </div>
          </div>

          {data.redFlags?.length > 0 && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.3)', borderRadius: '12px', padding: '10px', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#fecaca', margin: 0 }}>🚨 {data.redFlags.length} red flag(s) detected</p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: '0 0 2px 0' }}>Analyzed by MedicalPlain AI</p>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: '700', margin: 0 }}>medicalplain.vercel.app</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '80px' }}>
          <button onClick={shareToWhatsApp}
            style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '16px', padding: '16px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            📱 Share on WhatsApp
          </button>
          <button onClick={() => {
            if (navigator.share) navigator.share({ title: 'My MedicalPlain Report', text: `I analyzed my medical document. Try free at medicalplain.vercel.app`, url: 'https://medicalplain.vercel.app' });
          }} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', padding: '16px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            📤 Share via Phone
          </button>
          <button onClick={() => router.push('/results')}
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            ← View Full Report
          </button>
        </div>
      </div>
    </main>
  );
}

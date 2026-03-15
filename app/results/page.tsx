'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '../components/LanguageSelector';
import DownloadPDF from '../components/DownloadPDF';

export default function Results() {
  const [data, setData] = useState<any>(null);
  const [lang, setLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [remindersSet, setRemindersSet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('analysisResult');
    if (!stored) { router.push('/'); return; }
    const parsed = JSON.parse(stored);
    setData(parsed);
    setTranslatedSummary(parsed.summary || '');
  }, []);

  const setupRemindersFromPrescription = () => {
    if (!data?.medications) return;
    const existing = JSON.parse(localStorage.getItem('medReminders') || '[]');
    const newReminders = data.medications
      .filter((m: any) => m.name)
      .map((med: any) => {
        const times = med.reminderTimes || getTimesFromFrequency(med.frequencyCode || med.frequency);
        return times.map((time: string) => ({
          id: Date.now().toString() + Math.random(),
          medicine: med.name,
          dosage: med.dosage || '',
          time,
          frequency: med.frequency || 'daily',
          withFood: med.withFood || false,
          active: true,
          duration: med.duration || '',
          purpose: med.purpose || '',
        }));
      }).flat();

    const merged = [...existing, ...newReminders];
    localStorage.setItem('medReminders', JSON.stringify(merged));
    setRemindersSet(true);
    setTimeout(() => router.push('/reminders'), 1500);
  };

  const getTimesFromFrequency = (freq: string) => {
    const f = (freq || '').toLowerCase();
    if (f.includes('od') || f.includes('once') || f.includes('1-0-0')) return ['08:00'];
    if (f.includes('bd') || f.includes('twice') || f.includes('1-0-1')) return ['08:00', '20:00'];
    if (f.includes('tds') || f.includes('thrice') || f.includes('1-1-1')) return ['08:00', '14:00', '20:00'];
    if (f.includes('qid') || f.includes('four') || f.includes('1-1-1-1')) return ['08:00', '12:00', '16:00', '20:00'];
    if (f.includes('hs') || f.includes('bedtime') || f.includes('night')) return ['21:00'];
    if (f.includes('sos') || f.includes('as needed')) return ['08:00'];
    return ['08:00'];
  };

  const handleLanguageChange = async (newLang: string) => {
    setLang(newLang);
    if (newLang === 'en' || !data) return;
    setTranslating(true);
    const langNames: any = { hi: 'Hindi', ta: 'Tamil', te: 'Telugu' };
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.summary, targetLanguage: langNames[newLang] }),
      });
      const result = await res.json();
      setTranslatedSummary(result.translated);
    } catch { setTranslatedSummary(data.summary); }
    setTranslating(false);
  };

  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)' }}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>;

  const riskBg = (r: string) => !r ? '#f3f4f6' : r.toLowerCase() === 'low' || r.toLowerCase() === 'none' ? '#dcfce7' : r.toLowerCase() === 'medium' ? '#fef9c3' : '#fee2e2';
  const riskText = (r: string) => !r ? '#374151' : r.toLowerCase() === 'low' || r.toLowerCase() === 'none' ? '#166534' : r.toLowerCase() === 'medium' ? '#713f12' : '#991b1b';
  const statusBg = (s: string) => !s ? '#f3f4f6' : s.toLowerCase() === 'normal' ? '#dcfce7' : s.toLowerCase() === 'borderline' ? '#fef9c3' : s.toLowerCase() === 'critical' ? '#fee2e2' : '#ffedd5';
  const statusText = (s: string) => !s ? '#374151' : s.toLowerCase() === 'normal' ? '#166534' : s.toLowerCase() === 'borderline' ? '#713f12' : s.toLowerCase() === 'critical' ? '#991b1b' : '#9a3412';

  const cardStyle = { backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '16px' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← New Analysis</button>
          <button onClick={() => router.push('/chat')} style={{ marginLeft: 'auto', backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>💬 Ask Doctor</button>
        </div>

        <div style={cardStyle}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Translate Results</p>
          <LanguageSelector currentLang={lang} onChange={handleLanguageChange} />
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Clinical Analysis</h1>
            {data.overallRiskScore && <span style={{ backgroundColor: riskBg(data.overallRiskScore), color: riskText(data.overallRiskScore), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{data.overallRiskScore.toUpperCase()} RISK</span>}
          </div>
          {translating ? <div style={{ backgroundColor: 'var(--bg-secondary)', height: '60px', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}/> :
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>{translatedSummary || data.summary}</p>}
          {data.handwritingNotes && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '12px', padding: '10px', marginTop: '12px' }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>🔍 <strong>Handwriting notes:</strong> {data.handwritingNotes}</p>
            </div>
          )}
        </div>

        {data.medications?.filter((m: any) => m.name).length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>💊 Medications</h2>
              <button onClick={setupRemindersFromPrescription}
                style={{ backgroundColor: remindersSet ? '#22c55e' : '#7c3aed', color: 'white', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                {remindersSet ? '✅ Reminders Set!' : '⏰ Set All Reminders'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.medications.filter((m: any) => m.name).map((med: any, i: number) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#2563eb', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: 'white', fontWeight: '700', fontSize: '16px', margin: '0 0 2px 0' }}>{med.name}</p>
                      {med.genericName && <p style={{ color: '#bfdbfe', fontSize: '11px', margin: 0 }}>{med.genericName} • {med.drugClass}</p>}
                    </div>
                    <span style={{ backgroundColor: 'white', color: '#2563eb', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>{med.dosage}</span>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '12px' }}>
                        <p style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Purpose</p>
                        <p style={{ fontSize: '13px', color: '#1e3a5f', margin: 0, lineHeight: '1.4' }}>{med.purpose}</p>
                      </div>
                      <div style={{ backgroundColor: '#f5f3ff', borderRadius: '12px', padding: '12px' }}>
                        <p style={{ fontSize: '10px', color: '#7c3aed', fontWeight: '700', margin: '0 0 4px 0', textTransform: 'uppercase' }}>How It Works</p>
                        <p style={{ fontSize: '13px', color: '#3b1f7d', margin: 0, lineHeight: '1.4' }}>{med.howItWorks}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>When</p>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{med.bestTimeToTake || 'As prescribed'}</p>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>Frequency</p>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{med.frequencyCode || med.frequency}</p>
                      </div>
                      <div style={{ backgroundColor: med.withFood ? '#f0fdf4' : '#fff7ed', borderRadius: '10px', padding: '10px' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>With Food</p>
                        <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>{med.withFood ? '✅ Yes' : '⚠️ No'}</p>
                      </div>
                    </div>
                    {med.sideEffects && (
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                          Side Effects {med.sideEffects.riskPercentage && <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontWeight: '400' }}>{med.sideEffects.riskPercentage}</span>}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Common:</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{med.sideEffects.common?.map((s: string, j: number) => <span key={j} style={{ backgroundColor: '#fef9c3', color: '#713f12', fontSize: '11px', padding: '2px 8px', borderRadius: '8px' }}>{s}</span>)}</div></div>
                          <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Serious:</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{med.sideEffects.serious?.map((s: string, j: number) => <span key={j} style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '11px', padding: '2px 8px', borderRadius: '8px' }}>{s}</span>)}</div></div>
                        </div>
                      </div>
                    )}
                    {med.warnings?.length > 0 && <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '12px', padding: '10px' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#92400e', margin: '0 0 4px 0' }}>⚠️ WARNINGS</p>{med.warnings.map((w: string, j: number) => <p key={j} style={{ fontSize: '12px', color: '#78350f', margin: '2px 0' }}>• {w}</p>)}</div>}
                    {med.drugInteractions?.length > 0 && <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fb923c', borderRadius: '12px', padding: '10px' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#9a3412', margin: '0 0 4px 0' }}>🔄 DRUG INTERACTIONS</p>{med.drugInteractions.map((d: string, j: number) => <p key={j} style={{ fontSize: '12px', color: '#7c2d12', margin: '2px 0' }}>• {d}</p>)}</div>}
                    {med.importantNote && <div style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #2563eb', padding: '10px 12px', borderRadius: '0 12px 12px 0' }}><p style={{ fontSize: '13px', color: '#1e40af', fontWeight: '500', margin: 0 }}>📌 {med.importantNote}</p></div>}
                    <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div><p style={{ fontSize: '11px', color: '#166534', fontWeight: '700', margin: '0 0 2px 0' }}>💊 Buy Online</p><p style={{ fontSize: '11px', color: '#15803d', margin: 0 }}>Best price — Netmeds</p></div>
                      <a href={`https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(med.name)}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '12px', padding: '6px 14px', borderRadius: '10px', fontWeight: '600', textDecoration: 'none' }}>Buy →</a>
                    </div>
                    {(med.overdoseRisk || med.addictionRisk || med.pregnancySafe) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                        {med.overdoseRisk && <div style={{ backgroundColor: riskBg(med.overdoseRisk), borderRadius: '10px', padding: '8px' }}><p style={{ fontSize: '10px', fontWeight: '700', margin: '0 0 2px 0', color: riskText(med.overdoseRisk) }}>OVERDOSE</p><p style={{ fontSize: '12px', fontWeight: '700', color: riskText(med.overdoseRisk), margin: 0 }}>{med.overdoseRisk.toUpperCase()}</p></div>}
                        {med.addictionRisk && <div style={{ backgroundColor: riskBg(med.addictionRisk), borderRadius: '10px', padding: '8px' }}><p style={{ fontSize: '10px', fontWeight: '700', margin: '0 0 2px 0', color: riskText(med.addictionRisk) }}>ADDICTION</p><p style={{ fontSize: '12px', fontWeight: '700', color: riskText(med.addictionRisk), margin: 0 }}>{med.addictionRisk.toUpperCase()}</p></div>}
                        {med.pregnancySafe && <div style={{ backgroundColor: '#fdf2f8', borderRadius: '10px', padding: '8px' }}><p style={{ fontSize: '10px', fontWeight: '700', margin: '0 0 2px 0', color: '#831843' }}>PREGNANCY</p><p style={{ fontSize: '12px', fontWeight: '700', color: '#9d174d', margin: 0 }}>{med.pregnancySafe.toUpperCase()}</p></div>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.labValues?.filter((l: any) => l.testName).length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>🔬 Lab Results</h2>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {data.labValues.filter((l: any) => l.testName).map((lab: any, i: number) => (
                <div key={i} style={{ padding: '16px', borderTop: i !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div><p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '14px' }}>{lab.testName}</p>{lab.organAffected && <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{lab.organAffected}</p>}</div>
                    <div style={{ textAlign: 'right' }}><p style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{lab.value}</p><span style={{ backgroundColor: statusBg(lab.status), color: statusText(lab.status), fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>{lab.status?.toUpperCase()}</span></div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: '1.5' }}>{lab.plainExplanation}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Normal: {lab.normalRange} {lab.deviation && `• Deviation: ${lab.deviation}`}</p>
                  {lab.possibleCauses?.length > 0 && lab.status !== 'normal' && <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '8px', marginTop: '8px' }}><p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}><strong>Possible causes:</strong> {lab.possibleCauses.join(', ')}</p></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.redFlags?.filter((f: any) => f.flag || typeof f === 'string').length > 0 && (
          <div style={{ backgroundColor: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#b91c1c', marginBottom: '12px' }}>🚨 Red Flags</h2>
            {data.redFlags.map((flag: any, i: number) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <p style={{ fontWeight: '600', color: '#991b1b', fontSize: '14px', margin: '0 0 4px 0' }}>{flag.flag || flag}</p>
                {flag.urgency && <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', backgroundColor: flag.urgency.includes('emergency') ? '#dc2626' : '#fef3c7', color: flag.urgency.includes('emergency') ? 'white' : '#92400e' }}>{flag.urgency.toUpperCase()}</span>}
                {flag.reason && <p style={{ fontSize: '12px', color: '#dc2626', margin: '4px 0 0 0' }}>{flag.reason}</p>}
              </div>
            ))}
          </div>
        )}

        {data.questionsToAsk?.length > 0 && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>❓ Questions for Your Doctor</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.questionsToAsk.map((q: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#eff6ff', borderRadius: '12px', padding: '12px' }}>
                  <span style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i+1}</span>
                  <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.dietaryRestrictions?.length > 0 || data.lifestyleAdvice?.length > 0) && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '10px' }}>🥗 Diet & Lifestyle</h2>
            {data.dietaryRestrictions?.map((d: string, i: number) => <p key={i} style={{ fontSize: '13px', color: '#14532d', margin: '4px 0' }}>🚫 {d}</p>)}
            {data.lifestyleAdvice?.map((a: string, i: number) => <p key={i} style={{ fontSize: '13px', color: '#14532d', margin: '4px 0' }}>✅ {a}</p>)}
          </div>
        )}

        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '20px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><p style={{ fontWeight: '700', color: '#1e40af', fontSize: '14px', margin: '0 0 2px 0' }}>🩺 Book a Real Doctor</p><p style={{ fontSize: '12px', color: '#2563eb', margin: 0 }}>Practo — Video or clinic visit</p></div>
          <a href="https://www.practo.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#2563eb', color: 'white', fontSize: '12px', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>Book →</a>
        </div>

        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><p style={{ fontWeight: '700', color: '#166534', fontSize: '14px', margin: '0 0 2px 0' }}>🛡️ Health Insurance</p><p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>InsuranceDekho — Free comparison</p></div>
          <a href="https://www.insurancedekho.com/health-insurance" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '12px', padding: '8px 16px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>Quote →</a>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{data.disclaimer}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <button onClick={() => { const text = `I used MedicalPlain AI for clinical analysis. Try free at medicalplain.vercel.app`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); }}
            style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>📱 Share WhatsApp</button>
          <button onClick={() => router.push('/chat')}
            style={{ backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>💬 Ask Doctor</button>
        </div>
        <div style={{ marginBottom: '24px' }}><DownloadPDF data={data} /></div>
      </div>
    </main>
  );
}

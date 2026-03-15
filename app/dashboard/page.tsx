'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Vitals {
  weight: string; height: string; bloodPressureSys: string;
  bloodPressureDia: string; bloodSugar: string; heartRate: string;
  temperature: string; oxygenSat: string; date: string;
}

interface Profile {
  name: string; age: string; gender: string;
  bloodGroup: string; allergies: string; conditions: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({ name: '', age: '', gender: '', bloodGroup: '', allergies: '', conditions: '' });
  const [vitals, setVitals] = useState<Vitals>({ weight: '', height: '', bloodPressureSys: '', bloodPressureDia: '', bloodSugar: '', heartRate: '', temperature: '', oxygenSat: '', date: '' });
  const [vHistory, setVHistory] = useState<Vitals[]>([]);
  const [tab, setTab] = useState('overview');
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem('healthProfile');
    const v = localStorage.getItem('currentVitals');
    const h = localStorage.getItem('vitalsHistory');
    if (p) setProfile(JSON.parse(p));
    if (v) setVitals(JSON.parse(v));
    if (h) setVHistory(JSON.parse(h));
  }, []);

  const saveProfile = () => { localStorage.setItem('healthProfile', JSON.stringify(profile)); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const saveVitals = () => {
    const entry = { ...vitals, date: new Date().toLocaleDateString('en-IN') };
    const h = JSON.parse(localStorage.getItem('vitalsHistory') || '[]');
    h.unshift(entry);
    localStorage.setItem('vitalsHistory', JSON.stringify(h.slice(0, 30)));
    localStorage.setItem('currentVitals', JSON.stringify(entry));
    setVHistory(h.slice(0, 30));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const getBMI = () => {
    const w = parseFloat(vitals.weight); const h = parseFloat(vitals.height) / 100;
    if (!w || !h) return null;
    return (w / (h * h)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { label: 'Normal', color: '#22c55e' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const getHealthScore = () => {
    let score = 100;
    const bmi = parseFloat(getBMI() || '22');
    if (bmi < 18.5 || bmi > 30) score -= 15; else if (bmi > 25) score -= 8;
    const sys = parseFloat(vitals.bloodPressureSys);
    if (sys > 140) score -= 20; else if (sys > 120) score -= 10;
    const sugar = parseFloat(vitals.bloodSugar);
    if (sugar > 200) score -= 20; else if (sugar > 140) score -= 10;
    const hr = parseFloat(vitals.heartRate);
    if (hr > 100 || hr < 50) score -= 10;
    const spo2 = parseFloat(vitals.oxygenSat);
    if (spo2 < 95) score -= 15;
    return Math.max(score, 0);
  };

  const bmi = getBMI();
  const score = getHealthScore();
  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  const vitalCards = [
    { label: 'BMI', value: bmi || '--', unit: '', status: bmi ? getBMIStatus(parseFloat(bmi)).label : 'Enter weight & height', color: bmi ? getBMIStatus(parseFloat(bmi)).color : '#6b7280' },
    { label: 'Blood Pressure', value: vitals.bloodPressureSys && vitals.bloodPressureDia ? `${vitals.bloodPressureSys}/${vitals.bloodPressureDia}` : '--', unit: 'mmHg', status: vitals.bloodPressureSys ? (parseFloat(vitals.bloodPressureSys) > 140 ? 'High' : parseFloat(vitals.bloodPressureSys) > 120 ? 'Elevated' : 'Normal') : 'Not recorded', color: vitals.bloodPressureSys ? (parseFloat(vitals.bloodPressureSys) > 140 ? '#ef4444' : parseFloat(vitals.bloodPressureSys) > 120 ? '#f59e0b' : '#22c55e') : '#6b7280' },
    { label: 'Blood Sugar', value: vitals.bloodSugar || '--', unit: 'mg/dL', status: vitals.bloodSugar ? (parseFloat(vitals.bloodSugar) > 200 ? 'High' : parseFloat(vitals.bloodSugar) > 140 ? 'Borderline' : 'Normal') : 'Not recorded', color: vitals.bloodSugar ? (parseFloat(vitals.bloodSugar) > 200 ? '#ef4444' : parseFloat(vitals.bloodSugar) > 140 ? '#f59e0b' : '#22c55e') : '#6b7280' },
    { label: 'Heart Rate', value: vitals.heartRate || '--', unit: 'bpm', status: vitals.heartRate ? (parseFloat(vitals.heartRate) > 100 ? 'High' : parseFloat(vitals.heartRate) < 60 ? 'Low' : 'Normal') : 'Not recorded', color: vitals.heartRate ? (parseFloat(vitals.heartRate) > 100 || parseFloat(vitals.heartRate) < 60 ? '#f59e0b' : '#22c55e') : '#6b7280' },
    { label: 'Oxygen Sat', value: vitals.oxygenSat || '--', unit: '%', status: vitals.oxygenSat ? (parseFloat(vitals.oxygenSat) < 95 ? 'Low — See doctor' : 'Normal') : 'Not recorded', color: vitals.oxygenSat ? (parseFloat(vitals.oxygenSat) < 95 ? '#ef4444' : '#22c55e') : '#6b7280' },
    { label: 'Temperature', value: vitals.temperature || '--', unit: '°F', status: vitals.temperature ? (parseFloat(vitals.temperature) > 100.4 ? 'Fever' : parseFloat(vitals.temperature) < 97 ? 'Low' : 'Normal') : 'Not recorded', color: vitals.temperature ? (parseFloat(vitals.temperature) > 100.4 ? '#ef4444' : '#22c55e') : '#6b7280' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '16px' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>📊 Health Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['overview', 'vitals', 'profile', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
              whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
              backgroundColor: tab === t ? 'var(--blue-accent)' : 'var(--bg-card)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              boxShadow: tab === t ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '24px', marginBottom: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>YOUR HEALTH SCORE</p>
              <p style={{ fontSize: '64px', fontWeight: '700', color: scoreColor, margin: '0', lineHeight: '1' }}>{score}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>out of 100</p>
              <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', borderRadius: '8px', backgroundColor: scoreColor, width: score + '%', transition: 'width 1s ease' }}/>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {score >= 80 ? '🟢 Great health — keep it up!' : score >= 60 ? '🟡 Good — room for improvement' : '🔴 Concerning — please see a doctor'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {vitalCards.map((card, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: '1.2' }}>
                    {card.value} {card.unit && <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-muted)' }}>{card.unit}</span>}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: card.color, margin: 0 }}>{card.status}</p>
                </div>
              ))}
            </div>

            {profile.name && (
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '20px', flexShrink: 0 }}>{profile.name[0]?.toUpperCase()}</div>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{profile.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{profile.age} yrs • {profile.gender} • Blood: {profile.bloodGroup || 'Unknown'}</p>
                    {profile.conditions && <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>⚠️ {profile.conditions}</p>}
                    {profile.allergies && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '2px' }}>🚫 Allergic: {profile.allergies}</p>}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => router.push('/chat')} style={{ width: '100%', backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '16px', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              💬 Ask Dr. MedicalPlain about my health
            </button>
          </div>
        )}

        {tab === 'vitals' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>Record Today's Vitals</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Weight (kg)', key: 'weight', placeholder: '70' },
                { label: 'Height (cm)', key: 'height', placeholder: '170' },
                { label: 'BP Systolic', key: 'bloodPressureSys', placeholder: '120' },
                { label: 'BP Diastolic', key: 'bloodPressureDia', placeholder: '80' },
                { label: 'Blood Sugar (mg/dL)', key: 'bloodSugar', placeholder: '100' },
                { label: 'Heart Rate (bpm)', key: 'heartRate', placeholder: '72' },
                { label: 'Temperature (°F)', key: 'temperature', placeholder: '98.6' },
                { label: 'Oxygen Sat (%)', key: 'oxygenSat', placeholder: '98' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{field.label}</label>
                  <input
                    value={(vitals as any)[field.key]}
                    onChange={e => setVitals({ ...vitals, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    type="number"
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <button onClick={saveVitals} style={{ width: '100%', backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              {saved ? '✅ Saved!' : 'Save Vitals'}
            </button>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>My Health Profile</h2>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Your name' },
              { label: 'Age', key: 'age', placeholder: '35' },
              { label: 'Gender', key: 'gender', placeholder: 'Male/Female/Other' },
              { label: 'Blood Group', key: 'bloodGroup', placeholder: 'A+, B-, O+...' },
              { label: 'Known Allergies', key: 'allergies', placeholder: 'Penicillin, Aspirin...' },
              { label: 'Existing Conditions', key: 'conditions', placeholder: 'Diabetes, Hypertension...' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{field.label}</label>
                <input
                  value={(profile as any)[field.key]}
                  onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <button onClick={saveProfile} style={{ width: '100%', backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              {saved ? '✅ Profile Saved!' : 'Save Profile'}
            </button>
          </div>
        )}

        {tab === 'history' && (
          <div>
            {vHistory.length === 0 ? (
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '32px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No history yet. Record vitals in the Vitals tab.</p>
              </div>
            ) : vHistory.map((entry, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>{entry.date}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {entry.bloodPressureSys && <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>BP</p><p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{entry.bloodPressureSys}/{entry.bloodPressureDia}</p></div>}
                  {entry.bloodSugar && <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>Sugar</p><p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{entry.bloodSugar}</p></div>}
                  {entry.heartRate && <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>HR</p><p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{entry.heartRate}</p></div>}
                  {entry.oxygenSat && <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>SpO2</p><p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{entry.oxygenSat}%</p></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Vitals {
  weight: string;
  height: string;
  bloodPressureSys: string;
  bloodPressureDia: string;
  bloodSugar: string;
  heartRate: string;
  temperature: string;
  oxygenSat: string;
  date: string;
}

interface Profile {
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({ name: '', age: '', gender: '', bloodGroup: '', allergies: '', conditions: '' });
  const [vitals, setVitals] = useState<Vitals>({ weight: '', height: '', bloodPressureSys: '', bloodPressureDia: '', bloodSugar: '', heartRate: '', temperature: '', oxygenSat: '', date: '' });
  const [history, setHistory] = useState<Vitals[]>([]);
  const [tab, setTab] = useState('overview');
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem('healthProfile');
    const v = localStorage.getItem('currentVitals');
    const h = localStorage.getItem('vitalsHistory');
    if (p) setProfile(JSON.parse(p));
    if (v) setVitals(JSON.parse(v));
    if (h) setHistory(JSON.parse(h));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('healthProfile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveVitals = () => {
    const entry = { ...vitals, date: new Date().toLocaleDateString('en-IN') };
    const h = JSON.parse(localStorage.getItem('vitalsHistory') || '[]');
    h.unshift(entry);
    localStorage.setItem('vitalsHistory', JSON.stringify(h.slice(0, 30)));
    localStorage.setItem('currentVitals', JSON.stringify(entry));
    setHistory(h.slice(0, 30));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getBMI = () => {
    const w = parseFloat(vitals.weight);
    const h = parseFloat(vitals.height) / 100;
    if (!w || !h) return null;
    const bmi = w / (h * h);
    return bmi.toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const getHealthScore = () => {
    let score = 100;
    const bmi = parseFloat(getBMI() || '22');
    if (bmi < 18.5 || bmi > 30) score -= 15;
    else if (bmi > 25) score -= 8;
    const sys = parseFloat(vitals.bloodPressureSys);
    if (sys > 140) score -= 20;
    else if (sys > 120) score -= 10;
    const sugar = parseFloat(vitals.bloodSugar);
    if (sugar > 200) score -= 20;
    else if (sugar > 140) score -= 10;
    const hr = parseFloat(vitals.heartRate);
    if (hr > 100 || hr < 50) score -= 10;
    const spo2 = parseFloat(vitals.oxygenSat);
    if (spo2 < 95) score -= 15;
    return Math.max(score, 0);
  };

  const scoreColor = (s: number) => s >= 80 ? 'text-green-600' : s >= 60 ? 'text-yellow-600' : 'text-red-600';
  const bmi = getBMI();
  const score = getHealthScore();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-4">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">📊 Health Dashboard</h1>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['overview', 'vitals', 'profile', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
              <p className="text-sm text-gray-500 mb-1">YOUR HEALTH SCORE</p>
              <p className={`text-6xl font-bold ${scoreColor(score)}`}>{score}</p>
              <p className="text-gray-400 text-sm">out of 100</p>
              <div className="mt-3 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: score + '%' }}/>
              </div>
              <p className="text-xs text-gray-500 mt-2">{score >= 80 ? '🟢 Great health!' : score >= 60 ? '🟡 Room for improvement' : '🔴 Please consult a doctor'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {bmi && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <p className="text-xs text-gray-500">BMI</p>
                  <p className="text-3xl font-bold text-gray-900">{bmi}</p>
                  <p className={`text-sm font-medium ${getBMIStatus(parseFloat(bmi)).color}`}>{getBMIStatus(parseFloat(bmi)).label}</p>
                </div>
              )}
              {vitals.bloodPressureSys && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <p className="text-xs text-gray-500">BLOOD PRESSURE</p>
                  <p className="text-2xl font-bold text-gray-900">{vitals.bloodPressureSys}/{vitals.bloodPressureDia}</p>
                  <p className={`text-sm font-medium ${parseFloat(vitals.bloodPressureSys) > 140 ? 'text-red-600' : parseFloat(vitals.bloodPressureSys) > 120 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {parseFloat(vitals.bloodPressureSys) > 140 ? 'High' : parseFloat(vitals.bloodPressureSys) > 120 ? 'Elevated' : 'Normal'}
                  </p>
                </div>
              )}
              {vitals.bloodSugar && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <p className="text-xs text-gray-500">BLOOD SUGAR</p>
                  <p className="text-2xl font-bold text-gray-900">{vitals.bloodSugar} <span className="text-sm font-normal">mg/dL</span></p>
                  <p className={`text-sm font-medium ${parseFloat(vitals.bloodSugar) > 200 ? 'text-red-600' : parseFloat(vitals.bloodSugar) > 140 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {parseFloat(vitals.bloodSugar) > 200 ? 'High' : parseFloat(vitals.bloodSugar) > 140 ? 'Borderline' : 'Normal'}
                  </p>
                </div>
              )}
              {vitals.oxygenSat && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <p className="text-xs text-gray-500">OXYGEN SAT</p>
                  <p className="text-2xl font-bold text-gray-900">{vitals.oxygenSat}%</p>
                  <p className={`text-sm font-medium ${parseFloat(vitals.oxygenSat) < 95 ? 'text-red-600' : 'text-green-600'}`}>
                    {parseFloat(vitals.oxygenSat) < 95 ? 'Low — See doctor' : 'Normal'}
                  </p>
                </div>
              )}
            </div>

            {profile.name && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{profile.name[0]}</div>
                  <div>
                    <p className="font-bold text-gray-900">{profile.name}</p>
                    <p className="text-sm text-gray-600">{profile.age} yrs • {profile.gender} • Blood: {profile.bloodGroup}</p>
                    {profile.conditions && <p className="text-xs text-orange-600 mt-1">Conditions: {profile.conditions}</p>}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => router.push('/chat')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
              💬 Ask Dr. MedicalPlain about my health
            </button>
          </div>
        )}

        {tab === 'vitals' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-900 mb-4">Record Today's Vitals</h2>
            <div className="grid grid-cols-2 gap-3">
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
                  <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
                  <input
                    value={(vitals as any)[field.key]}
                    onChange={e => setVitals({...vitals, [field.key]: e.target.value})}
                    placeholder={field.placeholder}
                    type="number"
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
            <button onClick={saveVitals} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold">
              {saved ? '✅ Saved!' : 'Save Vitals'}
            </button>
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="font-bold text-gray-900 mb-4">My Health Profile</h2>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Your name' },
              { label: 'Age', key: 'age', placeholder: '35' },
              { label: 'Gender', key: 'gender', placeholder: 'Male/Female/Other' },
              { label: 'Blood Group', key: 'bloodGroup', placeholder: 'A+, B-, O+...' },
              { label: 'Known Allergies', key: 'allergies', placeholder: 'Penicillin, Aspirin...' },
              { label: 'Existing Conditions', key: 'conditions', placeholder: 'Diabetes, Hypertension...' },
            ].map(field => (
              <div key={field.key} className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block font-semibold">{field.label}</label>
                <input
                  value={(profile as any)[field.key]}
                  onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                  placeholder={field.placeholder}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
            <button onClick={saveProfile} className="w-full mt-2 bg-blue-600 text-white py-3 rounded-xl font-semibold">
              {saved ? '✅ Saved!' : 'Save Profile'}
            </button>
          </div>
        )}

        {tab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
                <p className="text-gray-500">No vitals history yet. Record your first entry in the Vitals tab.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border">
                    <p className="font-semibold text-gray-900 mb-2">{entry.date}</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {entry.bloodPressureSys && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">BP</p><p className="text-sm font-bold">{entry.bloodPressureSys}/{entry.bloodPressureDia}</p></div>}
                      {entry.bloodSugar && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Sugar</p><p className="text-sm font-bold">{entry.bloodSugar}</p></div>}
                      {entry.heartRate && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">HR</p><p className="text-sm font-bold">{entry.heartRate}</p></div>}
                      {entry.oxygenSat && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">SpO2</p><p className="text-sm font-bold">{entry.oxygenSat}%</p></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

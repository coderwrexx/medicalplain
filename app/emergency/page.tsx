'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Emergency() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = `${pos.coords.latitude},${pos.coords.longitude}`;
        setLocation(loc);
        setLoading(false);
      },
      () => { setLocation('Location unavailable'); setLoading(false); }
    );
  };

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-600' },
    { name: 'Emergency', number: '112', icon: '🆘', color: 'bg-red-700' },
    { name: 'Police', number: '100', icon: '👮', color: 'bg-blue-700' },
    { name: 'Fire', number: '101', icon: '🚒', color: 'bg-orange-600' },
    { name: 'Women Helpline', number: '1091', icon: '👩', color: 'bg-purple-600' },
    { name: 'Child Helpline', number: '1098', icon: '👶', color: 'bg-green-600' },
  ];

  const firstAid = [
    { condition: 'Heart Attack', steps: ['Call 108 immediately', 'Make person sit/lie comfortably', 'Loosen tight clothing', 'Give aspirin if available and not allergic', 'Do CPR if unconscious and not breathing'] },
    { condition: 'Stroke', steps: ['Call 108 immediately', 'Note time symptoms started', 'Do NOT give food or water', 'Lay on side if unconscious', 'Keep calm and reassure patient'] },
    { condition: 'Choking', steps: ['Ask "Are you choking?"', 'Give 5 back blows between shoulder blades', 'Give 5 abdominal thrusts (Heimlich)', 'Repeat until object dislodged', 'Call 108 if unconscious'] },
    { condition: 'Severe Bleeding', steps: ['Apply firm pressure with cloth', 'Elevate injured area above heart', 'Do not remove cloth — add more on top', 'Apply pressure for 15+ minutes', 'Call 108 for severe bleeding'] },
    { condition: 'Burns', steps: ['Cool with cold running water 20 mins', 'Remove jewelry near burn', 'Cover loosely with clean cloth', 'Do NOT use ice, butter, or toothpaste', 'Seek medical care for severe burns'] },
    { condition: 'Seizure', steps: ['Clear area of dangerous objects', 'Do not restrain the person', 'Turn gently on side', 'Do NOT put anything in mouth', 'Call 108 if seizure > 5 minutes'] },
  ];

  const [selectedAid, setSelectedAid] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-4">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">🚨 Emergency</h1>
        </div>

        <div className="bg-red-600 rounded-2xl p-5 mb-4 text-white text-center">
          <p className="text-lg font-bold mb-1">🆘 Medical Emergency?</p>
          <p className="text-red-100 text-sm mb-3">Call immediately — do not wait</p>
          <a href="tel:108" className="inline-block bg-white text-red-600 font-bold text-2xl px-8 py-3 rounded-2xl">
            📞 Call 108 — Ambulance
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {emergencyContacts.map(c => (
            <a key={c.number} href={`tel:${c.number}`}
              className={`${c.color} text-white rounded-2xl p-3 text-center`}>
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="font-bold text-sm">{c.name}</p>
              <p className="text-xs opacity-90">{c.number}</p>
            </a>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4">
          <h2 className="font-bold text-gray-900 mb-3">📍 Share My Location</h2>
          <button onClick={getLocation} disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold mb-2">
            {loading ? 'Getting location...' : '📍 Get My Location'}
          </button>
          {location && location !== 'Location unavailable' && (
            <a href={`https://maps.google.com?q=${location}`} target="_blank" rel="noopener noreferrer"
              className="block text-center text-blue-600 text-sm underline">
              View on Google Maps →
            </a>
          )}
          <a href="https://maps.google.com/search/hospital+near+me" target="_blank" rel="noopener noreferrer"
            className="block mt-2 text-center bg-green-50 text-green-700 border border-green-200 py-2 rounded-xl text-sm font-semibold">
            🏥 Find Nearest Hospital
          </a>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <h2 className="font-bold text-gray-900 mb-3">🩹 First Aid Guide</h2>
          <div className="space-y-2">
            {firstAid.map(aid => (
              <div key={aid.condition}>
                <button onClick={() => setSelectedAid(selectedAid === aid.condition ? null : aid.condition)}
                  className="w-full text-left bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-sm">{aid.condition}</span>
                  <span className="text-gray-400">{selectedAid === aid.condition ? '▲' : '▼'}</span>
                </button>
                {selectedAid === aid.condition && (
                  <div className="bg-blue-50 rounded-xl p-3 mt-1 space-y-1">
                    {aid.steps.map((step, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 font-bold">{i+1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

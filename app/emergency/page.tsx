'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Emergency() {
  const [location, setLocation] = useState<{lat: number; lng: number; address: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAid, setSelectedAid] = useState<string | null>(null);
  const router = useRouter();

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        setLoading(false);
      },
      () => { alert('Location access denied. Please enable location in browser settings.'); setLoading(false); }
    );
  };

  const openMap = (query: string) => {
    if (location) {
      window.open(`https://maps.google.com/maps?q=${encodeURIComponent(query)}&near=${location.lat},${location.lng}&zoom=14`, '_blank');
    } else {
      window.open(`https://maps.google.com/maps?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  const shareLocation = () => {
    if (!location) { alert('Please get your location first'); return; }
    const text = `🚨 MEDICAL EMERGENCY\nI need help! My location:\nhttps://maps.google.com?q=${location.lat},${location.lng}\nPlease call ambulance: 108`;
    if (navigator.share) {
      navigator.share({ title: 'MEDICAL EMERGENCY', text });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
  };

  const locationServices = [
    { label: '🏥 Hospitals Near Me', query: 'hospital near me', color: '#dc2626' },
    { label: '💊 Pharmacy Near Me', query: 'pharmacy chemist near me', color: '#7c3aed' },
    { label: '👨‍⚕️ Doctors Near Me', query: 'doctor clinic near me', color: '#2563eb' },
    { label: '🩺 Diagnostic Lab', query: 'diagnostic lab pathology near me', color: '#059669' },
    { label: '🦷 Dentist Near Me', query: 'dentist near me', color: '#d97706' },
    { label: '👁️ Eye Doctor', query: 'ophthalmologist eye doctor near me', color: '#0891b2' },
  ];

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: '🚑', color: '#dc2626' },
    { name: 'Emergency', number: '112', icon: '🆘', color: '#991b1b' },
    { name: 'Police', number: '100', icon: '👮', color: '#1d4ed8' },
    { name: 'Fire', number: '101', icon: '🚒', color: '#ea580c' },
    { name: 'Women Helpline', number: '1091', icon: '👩', color: '#7c3aed' },
    { name: 'Poison Control', number: '1800-116-117', icon: '☠️', color: '#374151' },
  ];

  const firstAid = [
    { condition: 'Heart Attack', steps: ['Call 108 immediately', 'Sit or lie down — do not walk', 'Loosen tight clothing around chest and neck', 'Chew aspirin 300mg if available and not allergic', 'Do CPR if unconscious and not breathing normally'] },
    { condition: 'Stroke (FAST)', steps: ['F — Face drooping? Ask to smile', 'A — Arm weakness? Raise both arms', 'S — Speech slurred? Ask to repeat a phrase', 'T — Time to call 108 immediately', 'Note exact time symptoms started — tell doctors'] },
    { condition: 'Choking (Adult)', steps: ['Ask loudly: "Are you choking?"', 'Give 5 firm back blows between shoulder blades', 'Give 5 abdominal thrusts — hands below ribs, push in and up', 'Alternate back blows and thrusts until object clears', 'Call 108 if person becomes unconscious'] },
    { condition: 'Severe Bleeding', steps: ['Press firmly with clean cloth — do not remove', 'Elevate injured limb above heart level', 'Add more cloth on top if soaks through — do not remove first cloth', 'Apply pressure continuously for minimum 15 minutes', 'Call 108 for spurting blood or deep wounds'] },
    { condition: 'Burns', steps: ['Cool burn with cold running water for 20 minutes', 'Remove jewelry and clothing near burn area', 'Cover loosely with clean non-fluffy material', 'Do NOT use ice, butter, toothpaste, or oil', 'Go to hospital for burns larger than palm, face, or deep burns'] },
    { condition: 'Seizure', steps: ['Clear area of all hard or sharp objects', 'Do NOT restrain — never hold them down', 'Turn gently on their side (recovery position)', 'Do NOT put anything in mouth', 'Call 108 if seizure lasts more than 5 minutes or person does not wake up'] },
    { condition: 'Diabetic Emergency', steps: ['If conscious and can swallow: give sugar — juice, glucose, sweet drink', 'Check if they have glucagon kit — inject if trained', 'If unconscious: do NOT give anything by mouth', 'Call 108 immediately for unconscious diabetic', 'Stay with them until ambulance arrives'] },
    { condition: 'Allergic Reaction (Anaphylaxis)', steps: ['Use epinephrine auto-injector (EpiPen) if available — outer thigh', 'Call 108 immediately — anaphylaxis is life threatening', 'Lay person flat with legs raised (unless breathing difficulty)', 'If trained and EpiPen used — give second dose after 5-15 min if no improvement', 'Tell doctors about all medications taken recently'] },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '16px' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>🚨 Emergency</h1>
        </div>

        <div style={{ backgroundColor: '#dc2626', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: '700', fontSize: '18px', margin: '0 0 4px 0' }}>🆘 Medical Emergency?</p>
          <p style={{ color: '#fecaca', fontSize: '13px', margin: '0 0 16px 0' }}>Call immediately — every second counts</p>
          <a href="tel:108" style={{ display: 'inline-block', backgroundColor: 'white', color: '#dc2626', fontWeight: '700', fontSize: '22px', padding: '12px 32px', borderRadius: '16px', textDecoration: 'none' }}>📞 108 — Ambulance</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {emergencyContacts.map(c => (
            <a key={c.number} href={`tel:${c.number}`} style={{ backgroundColor: c.color, borderRadius: '16px', padding: '12px 8px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              <p style={{ fontSize: '22px', margin: '0 0 4px 0' }}>{c.icon}</p>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '12px', margin: '0 0 2px 0' }}>{c.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0 }}>{c.number}</p>
            </a>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>📍 Location-Based Services</h2>
          {!location ? (
            <button onClick={getLocation} disabled={loading} style={{ width: '100%', backgroundColor: 'var(--blue-accent)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
              {loading ? '📡 Getting location...' : '📍 Get My Location First'}
            </button>
          ) : (
            <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '10px', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#166534', margin: '0 0 4px 0', fontWeight: '600' }}>✅ Location found</p>
              <p style={{ fontSize: '11px', color: '#15803d', margin: '0 0 8px 0' }}>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
              <button onClick={shareLocation} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                📤 Share My Location (WhatsApp)
              </button>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {locationServices.map(s => (
              <button key={s.label} onClick={() => openMap(s.query)}
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px', fontSize: '12px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '500' }}>
                {s.label}
              </button>
            ))}
          </div>
          {location && (
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href={`https://www.practo.com/consult/direct/new_consultation`} target="_blank" rel="noopener noreferrer"
                style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '12px', padding: '10px', fontSize: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', display: 'block' }}>
                🩺 Book Doctor Now
              </a>
              <a href={`https://www.netmeds.com`} target="_blank" rel="noopener noreferrer"
                style={{ backgroundColor: '#16a34a', color: 'white', borderRadius: '12px', padding: '10px', fontSize: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', display: 'block' }}>
                💊 Order Medicine
              </a>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '16px' }}>🩹 First Aid Guide</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {firstAid.map(aid => (
              <div key={aid.condition}>
                <button onClick={() => setSelectedAid(selectedAid === aid.condition ? null : aid.condition)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{aid.condition}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedAid === aid.condition ? '▲' : '▼'}</span>
                </button>
                {selectedAid === aid.condition && (
                  <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '12px', marginTop: '4px' }}>
                    {aid.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: i < aid.steps.length - 1 ? '8px' : 0, alignItems: 'flex-start' }}>
                        <span style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i+1}</span>
                        <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>{step}</p>
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

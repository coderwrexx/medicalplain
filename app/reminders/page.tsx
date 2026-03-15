'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Reminder {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  frequency: string;
  withFood: boolean;
  active: boolean;
  purpose?: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState({ medicine: '', dosage: '', time: '08:00', frequency: 'daily', withFood: false });
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('medReminders');
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const save = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem('medReminders', JSON.stringify(updated));
  };

  const add = () => {
    if (!form.medicine.trim()) return;
    const newR: Reminder = { id: Date.now().toString(), medicine: form.medicine, dosage: form.dosage, time: form.time, frequency: form.frequency, withFood: form.withFood, active: true };
    save([...reminders, newR]);
    setForm({ medicine: '', dosage: '', time: '08:00', frequency: 'daily', withFood: false });
    setAdding(false);
  };

  const toggle = (id: string) => save(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const remove = (id: string) => save(reminders.filter(r => r.id !== id));

  const activeCount = reminders.filter(r => r.active).length;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ color: 'var(--blue-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>⏰ Medicine Reminders</h1>
          {activeCount > 0 && <span style={{ marginLeft: 'auto', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>{activeCount} active</span>}
        </div>

        {reminders.length === 0 && !adding ? (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>💊</div>
            <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px', margin: '0 0 4px 0' }}>No reminders yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Add medicines to track your doses</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {reminders.map(r => (
              <div key={r.id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: `1px solid ${r.active ? 'var(--border-color)' : 'var(--border-color)'}`, opacity: r.active ? 1 : 0.5, boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px', margin: '0 0 2px 0' }}>{r.medicine}</p>
                    {r.dosage && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{r.dosage}</p>}
                    {r.purpose && <p style={{ fontSize: '12px', color: '#2563eb', margin: '0 0 8px 0' }}>For: {r.purpose}</p>}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>⏰ {r.time}</span>
                      <span style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{r.frequency}</span>
                      {r.withFood && <span style={{ backgroundColor: '#f0fdf4', color: '#166534', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>🍽️ With food</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '12px' }}>
                    <button onClick={() => toggle(r.id)} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: r.active ? '#dcfce7' : 'var(--bg-secondary)', color: r.active ? '#166534' : 'var(--text-muted)' }}>
                      {r.active ? '✓ Active' : 'Paused'}
                    </button>
                    <button onClick={() => remove(r.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {adding && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>Add New Reminder</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Medicine Name *</label>
                <input value={form.medicine} onChange={e => setForm({ ...form, medicine: e.target.value })}
                  placeholder="e.g. Metformin 500mg"
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Dosage</label>
                <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })}
                  placeholder="e.g. 500mg, 1 tablet"
                  style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Time</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}>
                    <option value="daily">Once daily</option>
                    <option value="twice daily">Twice daily</option>
                    <option value="three times daily">3 times daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.withFood} onChange={e => setForm({ ...form, withFood: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Take with food</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => setAdding(false)} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button onClick={add} disabled={!form.medicine.trim()} style={{ padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: '600', opacity: !form.medicine.trim() ? 0.5 : 1 }}>Save Reminder</button>
              </div>
            </div>
          </div>
        )}

        {!adding && (
          <button onClick={() => setAdding(true)} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}>
            + Add Medicine Reminder
          </button>
        )}

        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '14px', padding: '12px 16px', marginBottom: '80px' }}>
          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>💡 For actual phone notifications, install MedicalPlain as an app — tap "Add to Home Screen" in your browser.</p>
        </div>
      </div>
    </main>
  );
}

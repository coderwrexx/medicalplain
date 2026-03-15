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
    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicine: form.medicine,
      dosage: form.dosage,
      time: form.time,
      frequency: form.frequency,
      withFood: form.withFood,
      active: true,
    };
    save([...reminders, newReminder]);
    setForm({ medicine: '', dosage: '', time: '08:00', frequency: 'daily', withFood: false });
    setAdding(false);
  };

  const toggle = (id: string) => save(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const remove = (id: string) => save(reminders.filter(r => r.id !== id));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">⏰ Medicine Reminders</h1>
        </div>

        {reminders.length === 0 && !adding && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border mb-4">
            <div className="text-5xl mb-3">💊</div>
            <p className="text-gray-600 font-medium">No reminders set yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your medicines to get daily reminders</p>
          </div>
        )}

        {reminders.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl p-4 shadow-sm border mb-3 ${!r.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900">{r.medicine}</p>
                {r.dosage && <p className="text-sm text-gray-600">{r.dosage}</p>}
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">⏰ {r.time}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{r.frequency}</span>
                  {r.withFood && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">🍽️ With food</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(r.id)} className={`text-xs px-3 py-1 rounded-full ${r.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {r.active ? 'Active' : 'Paused'}
                </button>
                <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            </div>
          </div>
        ))}

        {adding && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border mb-4">
            <h2 className="font-bold text-gray-900 mb-4">Add New Reminder</h2>
            <input value={form.medicine} onChange={e => setForm({...form, medicine: e.target.value})}
              placeholder="Medicine name (e.g. Metformin)" className="w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-400"/>
            <input value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})}
              placeholder="Dosage (e.g. 500mg)" className="w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-400"/>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">TIME</label>
                <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">FREQUENCY</label>
                <select value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="daily">Daily</option>
                  <option value="twice daily">Twice daily</option>
                  <option value="three times daily">3x daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input type="checkbox" checked={form.withFood} onChange={e => setForm({...form, withFood: e.target.checked})} className="w-4 h-4"/>
              <span className="text-sm text-gray-700">Take with food</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setAdding(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={add} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">Save Reminder</button>
            </div>
          </div>
        )}

        {!adding && (
          <button onClick={() => setAdding(true)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl">
            + Add Medicine Reminder
          </button>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-yellow-800 text-xs">💡 Tip: For actual phone notifications, install MedicalPlain as an app (tap "Add to Home Screen" in your browser).</p>
        </div>
      </div>
    </main>
  );
}

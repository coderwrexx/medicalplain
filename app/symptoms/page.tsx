'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Symptoms() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, duration, age, gender }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert('Error analyzing symptoms.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline text-sm">← Home</button>
          <h1 className="text-2xl font-bold text-gray-900 ml-auto mr-auto">Symptom Checker</h1>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
            <p className="text-gray-600 mb-4">Describe what you are feeling and our MBBS-level AI will suggest possible causes and next steps.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Symptoms</label>
                <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., headache, mild fever, body ache..." className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 2 days" className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 25" className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                 <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none bg-white">
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                 </select>
              </div>
              
              <button onClick={analyze} disabled={loading || !symptoms} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'Analyzing...' : 'Check Symptoms →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
               <div className="flex justify-between items-start mb-4">
                 <h2 className="text-xl font-bold text-gray-900">Analysis Result</h2>
                 <button onClick={() => setResult(null)} className="text-sm text-blue-600 hover:underline">Check again</button>
               </div>
               
               <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${result.urgencyLevel?.includes('Emergency') ? 'bg-red-100 text-red-700' : result.urgencyLevel?.includes('Urgent') ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                 {result.urgencyLevel?.toUpperCase()}
               </div>
               
               <div className="space-y-3 mb-6">
                 <h3 className="font-semibold text-gray-800">Possible Conditions:</h3>
                 {result.possibleConditions?.map((c: any, i: number) => (
                   <div key={i} className="bg-blue-50 rounded-xl p-3">
                     <div className="flex justify-between font-bold text-blue-900 mb-1">
                       <span>{c.condition}</span>
                       <span className="text-xs px-2 py-0.5 bg-blue-200 rounded-full">{c.probability} Prob</span>
                     </div>
                     <p className="text-sm text-blue-800">{c.description}</p>
                   </div>
                 ))}
               </div>
               
               <div className="bg-purple-50 rounded-xl p-4 mb-4">
                 <h3 className="font-semibold text-purple-900 mb-1">Recommendation:</h3>
                 <p className="text-sm text-purple-800">{result.recommendation}</p>
               </div>
               
               {result.redFlags?.length > 0 && (
                 <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                   <h3 className="font-semibold text-red-900 mb-1">🚨 Watch out for:</h3>
                   <ul className="list-disc pl-4 text-sm text-red-800 space-y-1">
                     {result.redFlags.map((flag: string, i: number) => <li key={i}>{flag}</li>)}
                   </ul>
                 </div>
               )}
               
               <p className="text-xs text-gray-500 text-center">{result.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

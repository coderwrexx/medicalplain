'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Interactions() {
  const router = useRouter();
  const [medications, setMedications] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkInteractions = async () => {
    if (!medications) return;
    setLoading(true);
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications, age, conditions }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert('Error analyzing interactions.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline text-sm">← Home</button>
          <h1 className="text-2xl font-bold text-gray-900 ml-auto mr-auto">Drug Interactions</h1>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
            <p className="text-gray-600 mb-4">Taking multiple medicines? Check if they are safe to mix. Our AI cross-references thousands of pharmacological records.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Medications (comma separated)</label>
                <textarea value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g., Aspirin, Lisinopril, Metformin" className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 55" className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Existing Conditions</label>
                  <input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g., Diabetes, Asthma" className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
              
              <button onClick={checkInteractions} disabled={loading || !medications} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 mt-2">
                {loading ? 'Analyzing Pharmacology...' : 'Check Interactions →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
               <div className="flex justify-between items-start mb-4">
                 <h2 className="text-xl font-bold text-gray-900">Interaction Report</h2>
                 <button onClick={() => setResult(null)} className="text-sm text-blue-600 hover:underline">Check new drugs</button>
               </div>
               
               <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${result.isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {result.isSafe ? '✅ Generally Safe to Mix' : '⚠️ Warning: Harmful Interactions Found'}
               </div>
               
               {result.interactions?.length > 0 ? (
                 <div className="space-y-4 mb-6">
                   <h3 className="font-semibold text-gray-800 border-b pb-2">Identified Interactions:</h3>
                   {result.interactions.map((int: any, i: number) => (
                     <div key={i} className={`rounded-xl p-4 border ${int.severity === 'High' ? 'bg-red-50 border-red-200' : int.severity === 'Medium' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'}`}>
                       <div className="flex justify-between font-bold mb-2">
                         <span className={int.severity === 'High' ? 'text-red-900' : int.severity === 'Medium' ? 'text-orange-900' : 'text-yellow-900'}>{int.drugs}</span>
                         <span className={`text-xs px-2 py-0.5 rounded-full ${int.severity === 'High' ? 'bg-red-200 text-red-800' : int.severity === 'Medium' ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800'}`}>{int.severity} Risk</span>
                       </div>
                       <p className="text-sm text-gray-800 mb-2"><span className="font-semibold">Effect: </span>{int.description}</p>
                       <p className="text-sm text-gray-800"><span className="font-semibold">Action: </span>{int.action}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border">No major negative interactions were found between these specific medications.</p>
               )}
               
               {result.generalWarnings?.length > 0 && (
                 <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
                   <h3 className="font-semibold text-purple-900 mb-2">📌 General Guidelines:</h3>
                   <ul className="list-disc pl-4 text-sm text-purple-800 space-y-1">
                     {result.generalWarnings.map((warning: string, i: number) => <li key={i}>{warning}</li>)}
                   </ul>
                 </div>
               )}
               
               <p className="text-xs text-gray-500 text-center mt-6">{result.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

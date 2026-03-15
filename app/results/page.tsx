'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Results() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('analysisResult');
    if (!stored) { router.push('/'); return; }
    setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  const riskColor = (risk: string) => {
    if (!risk) return 'bg-gray-100 text-gray-700';
    if (risk.toLowerCase() === 'low' || risk.toLowerCase() === 'none') return 'bg-green-100 text-green-700';
    if (risk.toLowerCase() === 'medium' || risk.toLowerCase() === 'borderline') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const statusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    if (status.toLowerCase() === 'normal') return 'bg-green-100 text-green-700';
    if (status.toLowerCase() === 'borderline') return 'bg-yellow-100 text-yellow-700';
    if (status.toLowerCase() === 'critical') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">

        <div className="flex items-center gap-3 mb-6 pt-4">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline text-sm">← New Analysis</button>
          <button onClick={() => router.push('/chat')} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-full text-sm">💬 Ask Dr. MedicalPlain</button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900">Clinical Analysis</h1>
            {data.overallRiskScore && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${riskColor(data.overallRiskScore)}`}>
                {data.overallRiskScore?.toUpperCase()} RISK
              </span>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          {data.overallHealthStatus && (
            <p className="text-sm text-gray-500 mt-2">Status: <span className="font-semibold">{data.overallHealthStatus}</span></p>
          )}
        </div>

        {data.redFlags?.filter((f: any) => f.flag || typeof f === 'string').length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-4">
            <h2 className="text-lg font-bold text-red-700 mb-3">🚨 Red Flags — Action Required</h2>
            {data.redFlags.map((flag: any, i: number) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="text-red-800 font-medium">{flag.flag || flag}</p>
                {flag.urgency && <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
                  flag.urgency.includes('emergency') ? 'bg-red-600 text-white' :
                  flag.urgency.includes('soon') ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'}`}>{flag.urgency.toUpperCase()}</span>}
                {flag.reason && <p className="text-red-600 text-sm mt-1">{flag.reason}</p>}
              </div>
            ))}
          </div>
        )}

        {data.medications?.filter((m: any) => m.name).length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">💊 Medication Analysis</h2>
            <div className="space-y-4">
              {data.medications.filter((m: any) => m.name).map((med: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="bg-blue-600 px-5 py-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold text-lg">{med.name}</h3>
                      {med.genericName && <p className="text-blue-100 text-xs">{med.genericName} • {med.drugClass}</p>}
                    </div>
                    <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{med.dosage}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-600 font-semibold mb-1">PURPOSE</p>
                        <p className="text-sm text-gray-800">{med.purpose}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-xs text-purple-600 font-semibold mb-1">HOW IT WORKS</p>
                        <p className="text-sm text-gray-800">{med.howItWorks}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-xl p-2">
                        <p className="text-xs text-gray-500">BEST TIME</p>
                        <p className="text-sm font-semibold text-gray-800">{med.bestTimeToTake || 'As prescribed'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2">
                        <p className="text-xs text-gray-500">FREQUENCY</p>
                        <p className="text-sm font-semibold text-gray-800">{med.frequency || med.dosage}</p>
                      </div>
                      <div className={`rounded-xl p-2 ${med.withFood ? 'bg-green-50' : 'bg-orange-50'}`}>
                        <p className="text-xs text-gray-500">WITH FOOD</p>
                        <p className="text-sm font-semibold">{med.withFood ? '✅ Yes' : '⚠️ No'}</p>
                      </div>
                    </div>
                    {med.sideEffects && (
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-2">SIDE EFFECTS
                          {med.sideEffects.riskPercentage && (
                            <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-normal">
                              {med.sideEffects.riskPercentage}
                            </span>
                          )}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Common:</p>
                            {med.sideEffects.common?.map((s: string, j: number) => (
                              <span key={j} className="inline-block bg-yellow-50 text-yellow-800 text-xs px-2 py-0.5 rounded mr-1 mb-1">{s}</span>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Serious:</p>
                            {med.sideEffects.serious?.map((s: string, j: number) => (
                              <span key={j} className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded mr-1 mb-1">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {med.overdoseRisk && (
                        <div className={`rounded-lg p-2 text-center ${riskColor(med.overdoseRisk)}`}>
                          <p className="text-xs font-semibold">OVERDOSE RISK</p>
                          <p className="text-sm font-bold">{med.overdoseRisk?.toUpperCase()}</p>
                        </div>
                      )}
                      {med.addictionRisk && (
                        <div className={`rounded-lg p-2 text-center ${riskColor(med.addictionRisk)}`}>
                          <p className="text-xs font-semibold">ADDICTION RISK</p>
                          <p className="text-sm font-bold">{med.addictionRisk?.toUpperCase()}</p>
                        </div>
                      )}
                      {med.pregnancySafe && (
                        <div className="bg-pink-50 text-pink-700 rounded-lg p-2 text-center">
                          <p className="text-xs font-semibold">PREGNANCY</p>
                          <p className="text-sm font-bold">{med.pregnancySafe?.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                    {med.warnings?.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-yellow-700 mb-2">⚠️ WARNINGS</p>
                        {med.warnings.map((w: string, j: number) => (
                          <p key={j} className="text-sm text-yellow-800">• {w}</p>
                        ))}
                      </div>
                    )}
                    {med.drugInteractions?.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-orange-700 mb-2">🔄 DRUG INTERACTIONS</p>
                        {med.drugInteractions.map((d: string, j: number) => (
                          <p key={j} className="text-sm text-orange-800">• {d}</p>
                        ))}
                      </div>
                    )}
                    {med.importantNote && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-xl">
                        <p className="text-sm text-blue-800 font-medium">📌 {med.importantNote}</p>
                      </div>
                    )}
                    {med.missedDoseInstruction && (
                      <p className="text-xs text-gray-600"><span className="font-semibold">Missed dose: </span>{med.missedDoseInstruction}</p>
                    )}
                    {med.storageInstructions && (
                      <p className="text-xs text-gray-600"><span className="font-semibold">Storage: </span>{med.storageInstructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.labValues?.filter((l: any) => l.testName).length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">🔬 Lab Results</h2>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {data.labValues.filter((l: any) => l.testName).map((lab: any, i: number) => (
                <div key={i} className={`p-4 ${i !== 0 ? 'border-t' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{lab.testName}</p>
                      {lab.organAffected && <p className="text-xs text-gray-500">{lab.organAffected}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-gray-900">{lab.value}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusColor(lab.status)}`}>
                        {lab.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{lab.plainExplanation}</p>
                  <div className="flex justify-between text-xs text-gray-500 flex-wrap gap-1">
                    <span>Normal: {lab.normalRange}</span>
                    {lab.deviation && <span>Deviation: {lab.deviation}</span>}
                    {lab.urgencyLevel && (
                      <span className={lab.urgencyLevel === 'urgent' || lab.urgencyLevel === 'emergency' ? 'text-red-600 font-bold' : ''}>
                        {lab.urgencyLevel?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {lab.possibleCauses?.length > 0 && lab.status !== 'normal' && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600"><span className="font-semibold">Possible causes: </span>{lab.possibleCauses.join(', ')}</p>
                    </div>
                  )}
                  {lab.whatToMonitor && (
                    <p className="text-xs text-gray-500 mt-1"><span className="font-semibold">Monitor: </span>{lab.whatToMonitor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.drugInteractionWarnings?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-4">
            <h2 className="text-lg font-bold text-orange-800 mb-3">🔄 Drug Interaction Warnings</h2>
            {data.drugInteractionWarnings.map((w: string, i: number) => (
              <p key={i} className="text-orange-700 text-sm mb-1">⚠️ {w}</p>
            ))}
          </div>
        )}

        {(data.dietaryRestrictions?.length > 0 || data.lifestyleAdvice?.length > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
            <h2 className="text-lg font-bold text-green-800 mb-3">🥗 Diet & Lifestyle</h2>
            {data.dietaryRestrictions?.map((d: string, i: number) => (
              <p key={i} className="text-green-700 text-sm mb-1">🚫 {d}</p>
            ))}
            {data.lifestyleAdvice?.map((a: string, i: number) => (
              <p key={i} className="text-green-700 text-sm mb-1">✅ {a}</p>
            ))}
          </div>
        )}

        {data.questionsToAsk?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">❓ Questions to Ask Your Doctor</h2>
            <div className="space-y-3">
              {data.questionsToAsk.map((q: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                  <p className="text-gray-800 text-sm">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.followUpRecommendations?.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-4">
            <h2 className="text-lg font-bold text-purple-800 mb-3">📅 Follow-up Recommendations</h2>
            {data.followUpRecommendations.map((r: string, i: number) => (
              <p key={i} className="text-purple-700 text-sm mb-1">• {r}</p>
            ))}
          </div>
        )}

        <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
          <p className="text-gray-600 text-xs">{data.disclaimer}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => {
              const text = `I used MedicalPlain AI to get a clinical-level analysis of my medical document. Try it free at medicalplain.vercel.app`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
            }}
            className="bg-green-500 text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-600"
          >
            📱 Share on WhatsApp
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700"
          >
            💬 Ask Follow-up
          </button>
        </div>

      </div>
    </main>
  );
}

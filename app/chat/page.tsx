'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Dr. MedicalPlain, your personal MBBS-level AI doctor.\n\nI can help you with:\n\n💊 Medication questions — dosage, side effects, interactions\n🔬 Lab report interpretation\n🏥 Symptoms and what they mean\n⚠️ Drug safety and risk percentages\n🍎 Diet and lifestyle advice\n\nWhat would you like to know today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const quickQuestions = [
    "Side effects of Metformin?",
    "My HbA1c is 7.2, is that bad?",
    "Can I take Paracetamol + Ibuprofen?",
    "What does high creatinine mean?",
    "Is Paracetamol safe in pregnancy?",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700 text-xl">←</button>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">Dr</div>
        <div>
          <p className="font-bold text-gray-900">Dr. MedicalPlain</p>
          <p className="text-xs text-green-500">● Online — MBBS AI Medical Expert</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 shadow-sm border rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                <span className="text-xs text-gray-400 ml-2">Dr. MedicalPlain is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 shadow-lg">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => setInput(q)}
              className="whitespace-nowrap text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 flex-shrink-0">
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask any medical question..."
            className="flex-1 border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 text-lg">
            ➤
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">For emergencies call 112. Not a substitute for professional care.</p>
      </div>
    </div>
  );
}

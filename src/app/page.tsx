"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("History load error:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });
      
      const data = await res.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      }
    } catch (err) {
      console.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 shadow-xl border-x">
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 text-center shadow-md relative">
  {/* Admin Login Button */}
  <Link 
    href="/admin" 
    className="absolute top-4 right-4 text-[10px] bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-full transition-all border border-blue-500"
  >
    Admin Login
  </Link>
  
  <h1 className="text-2xl font-bold">Uswa College Bhowana</h1>
  <p className="text-xs opacity-80">Kalri Bypass Road Bhowana</p>
</header>
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 && !loading && (
          <div className="text-center mt-10">
            <p className="text-gray-400">Assalam-o-Alaikum! How can I help you today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 text-xs p-3 rounded-lg animate-pulse">
              Uswa AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything about Uswa College..."
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white p-4 rounded-full transition-all"
          >
            ➤
          </button>
        </div>
        <div className="text-center mt-3 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          Designed and Trained by Ghulam Abbas Bhatti
        </div>
      </div>
    </main>
  );
}
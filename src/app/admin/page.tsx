"use client";

import { useState, useEffect } from "react";

// --- AdminDashboard Component (CRUD Logic) ---
function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/knowledge');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    await fetch('/api/admin/knowledge', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, question, answer })
    });
    setQuestion(""); setAnswer(""); setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/knowledge?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Uswa College Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg mb-8 shadow-sm">
        <input 
          className="w-full p-2 mb-2 border rounded" 
          placeholder="Question" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          required 
        />
        <textarea 
          className="w-full p-2 mb-2 border rounded" 
          placeholder="Answer" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
          required 
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Entry" : "Save to Database"}
        </button>
      </form>
      
      <table className="w-full border-collapse bg-white shadow-sm">
        <thead className="bg-blue-900 text-white">
          <tr><th className="p-3">Question</th><th className="p-3">Answer</th><th className="p-3">Actions</th></tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.question}</td>
              <td className="p-3">{item.answer}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => { setEditingId(item.id); setQuestion(item.question); setAnswer(item.answer); }} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Main Admin Page (Login Logic) ---
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <form onSubmit={handleLogin} className="p-8 border rounded shadow-md bg-white w-96">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input 
            className="w-full p-2 mb-2 border rounded" 
            placeholder="Username" 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            className="w-full p-2 mb-4 border rounded" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  return <AdminDashboard />;
}
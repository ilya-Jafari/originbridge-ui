"use client";
import React, { useState } from 'react';
import suppliersData from '../data/supplier_test.json';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Einfache Filterung für die Anzeige
  const filteredSuppliers = suppliersData.filter(s => 
    s.Unternehmen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.Sektor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAISearch = async () => {
    if (!searchTerm) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: searchTerm }),
      });
      const data = await res.json();
      setAiResponse(data.answer);
    } catch (err) {
      setAiResponse("Fehler: API-Key nicht konfiguriert oder Verbindung fehlgeschlagen.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter">ORIGIN<span className="text-blue-600">BRIDGE</span></h1>
          <p className="text-slate-500 font-medium mt-2">The Industrial Intelligence Layer</p>
        </header>

        {/* AI Search Engine */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 mb-12">
          <div className="flex gap-4">
            <input 
              type="text"
              placeholder="Was suchst du? (z.B. 'Tomatenpaste aus den USA mit hohem Brix')"
              className="flex-1 p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={handleAISearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Analysiere..." : "KI-Expertise"}
            </button>
          </div>

          {aiResponse && (
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-600">
              <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                <span>🤖 AI Sourcing Insights:</span>
              </h4>
              <p className="text-blue-800 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Database View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.ID} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{supplier.Sektor}</span>
                <span className="text-xs bg-slate-100 p-1 px-2 rounded font-mono">{supplier.ID}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{supplier.Unternehmen}</h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">📍 {supplier.Hauptstandort}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded"><strong>Hub:</strong> {supplier.Exporthub}</div>
                <div className="bg-slate-50 p-2 rounded"><strong>Logistik:</strong> FOB / CIF</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"use client";
import React, { useState } from 'react';
// Wir nutzen hier den relativen Pfad, der in deinem Screenshot korrekt aussieht
import suppliersData from '../data/originbridge_master_db.json';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // KORREKTUR: Wir nutzen jetzt 'company_name' und 'sector' passend zur neuen Datei
  const filteredSuppliers = suppliersData.filter(s => 
    s.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.product.toLowerCase().includes(searchTerm.toLowerCase())
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
      setAiResponse("Fehler: Verbindung zur KI fehlgeschlagen.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-16 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter">ORIGIN<span className="text-blue-600">BRIDGE</span></h1>
          <p className="text-slate-500 font-medium mt-2">100+ Verified Industrial Suppliers Loaded</p>
        </header>

        {/* AI Search Section */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 mb-12">
          <div className="flex gap-4">
            <input 
              type="text"
              placeholder="Suchen nach Produkt, Land oder Qualität..."
              className="flex-1 p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={handleAISearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Matching..." : "KI-Expertise"}
            </button>
          </div>

          {aiResponse && (
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-600">
              <h4 className="text-blue-900 font-bold mb-2">🤖 AI Sourcing Insights:</h4>
              <p className="text-blue-800 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {supplier.sector}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{supplier.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{supplier.company_name}</h3>
              <p className="text-slate-500 text-xs mb-4">📍 {supplier.location.city}, {supplier.location.country}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Produkt:</span>
                  <span className="font-semibold">{supplier.product}</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Export Hub:</span>
                  <span className="font-semibold">{supplier.export_hub}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Logistik:</span>
                  <span className="font-semibold text-green-600">{supplier.logistics.incoterms}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
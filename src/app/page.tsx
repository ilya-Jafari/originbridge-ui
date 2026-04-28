"use client";
import React, { useState } from 'react';
import { Search, Globe, Box, Factory, Zap, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import suppliersData from '../data/originbridge_master_db.json';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (err) { setAiResponse("Fehler bei der KI-Analyse."); }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ORIGIN<span className="text-blue-600">BRIDGE</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1"><Activity size={14} /> System Live</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">100+ Nodes</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Industrial Sourcing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 text-6xl">Redefined.</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Verbinden Sie sich direkt mit globalen Produzenten. KI-gestützte Validierung von technischen Datenblättern und Logistikkapazitäten.
          </p>
        </div>

        {/* Search & AI Section */}
        <div className="relative z-10 -mt-8 mb-20">
          <div className="bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-2 max-w-4xl mx-auto">
            <div className="pl-4 text-slate-400">
              <Search size={24} />
            </div>
            <input 
              type="text"
              placeholder="Suche nach Spezifikationen (z.B. 'Brix 31%', 'HDPE', 'FOB Rotterdam')..."
              className="flex-1 p-4 bg-transparent text-lg outline-none placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={handleAISearch}
              disabled={isLoading}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              KI-Analyse
            </button>
          </div>

          {/* AI Response Box (Modern Style) */}
          {aiResponse && (
            <div className="max-w-4xl mx-auto mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Zap size={120} />
                </div>
                <h4 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  AI Intelligence Report
                </h4>
                <p className="text-lg leading-relaxed font-medium text-slate-100 relative z-10">{aiResponse}</p>
              </div>
            </div>
          )}
        </div>

        {/* Grid Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gefundene Supplier ({filteredSuppliers.length})</h3>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            <span className="text-xs font-bold text-slate-600">Database Live</span>
          </div>
        </div>

        {/* Supplier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500">
              <div className="flex justify-between items-center mb-8">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {supplier.sector === 'Agro' ? <Factory size={20} className="text-slate-400 group-hover:text-blue-500" /> : <Box size={20} className="text-slate-400 group-hover:text-blue-500" />}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
                  <ShieldCheck size={12} /> {supplier.id}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{supplier.company_name}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <Globe size={14} />
                <span>{supplier.location.country}</span>
                <span className="text-slate-200">•</span>
                <span>{supplier.export_hub}</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Produkt</span>
                  <span className="text-sm font-semibold bg-slate-100 px-3 py-1 rounded-lg">{supplier.product}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Incoterm</span>
                  <span className="text-sm font-black text-blue-600">{supplier.logistics.incoterms}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center justify-center gap-2">
                Details ansehen <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
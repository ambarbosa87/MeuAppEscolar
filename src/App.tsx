import React, { useState, useEffect } from 'react';
import { Calendar, Info, Settings, Search, CheckCircle, AlertCircle, School } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SchoolClass = 
  | "Maternal (Parcial)"
  | "Maternal I (Parcial)"
  | "Maternal II (Integral)"
  | "Maternal III (Parcial)"
  | "1º Período (Parcial)"
  | "2º Período (Parcial)"
  | "Muito novo(a)"
  | "Muito velho(a)";

export default function App() {
  const [birthDateStr, setBirthDateStr] = useState<string>('01/01/2022');
  const [refYear, setRefYear] = useState<number>(2026);
  const [result, setResult] = useState<SchoolClass | null>(null);
  const [ageOnCutoff, setAgeOnCutoff] = useState<number | null>(null);

  const calculateClass = () => {
    const parts = birthDateStr.split('/');
    if (parts.length !== 3) {
      setResult(null);
      return;
    }
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    
    const birth = new Date(year, month, day);
    
    // Validate date
    if (isNaN(birth.getTime()) || birth.getFullYear() !== year || birth.getMonth() !== month || birth.getDate() !== day) {
      setResult(null);
      return;
    }

    const cutoff = new Date(refYear, 2, 31); // March 31st (month is 0-indexed)
    
    // Calculate age on cutoff date
    let age = cutoff.getFullYear() - birth.getFullYear();
    const m = cutoff.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && cutoff.getDate() < birth.getDate())) {
      age--;
    }
    
    setAgeOnCutoff(age);

    // Maternal (Parcial): Born between 01/04 of previous year and 01/10 of previous year
    const maternalStart = new Date(refYear - 1, 3, 1);
    const maternalEnd = new Date(refYear - 1, 9, 1);
    
    if (birth >= maternalStart && birth <= maternalEnd) {
      setResult("Maternal (Parcial)");
      return;
    }

    if (age === 1) {
      setResult("Maternal I (Parcial)");
    } else if (age === 2) {
      setResult("Maternal II (Integral)");
    } else if (age === 3) {
      setResult("Maternal III (Parcial)");
    } else if (age === 4) {
      setResult("1º Período (Parcial)");
    } else if (age === 5) {
      setResult("2º Período (Parcial)");
    } else if (age < 1) {
      setResult("Muito novo(a)");
    } else {
      setResult("Muito velho(a)");
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR');
  };

  const intervals = [
    { name: "2º Período", start: new Date(refYear - 6, 3, 1), end: new Date(refYear - 5, 2, 31) },
    { name: "1º Período", start: new Date(refYear - 5, 3, 1), end: new Date(refYear - 4, 2, 31) },
    { name: "Maternal III", start: new Date(refYear - 4, 3, 1), end: new Date(refYear - 3, 2, 31) },
    { name: "Maternal II", start: new Date(refYear - 3, 3, 1), end: new Date(refYear - 2, 2, 31) },
    { name: "Maternal I", start: new Date(refYear - 2, 3, 1), end: new Date(refYear - 1, 2, 31) },
    { name: "Maternal (Parcial)", start: new Date(refYear - 1, 3, 1), end: new Date(refYear - 1, 9, 1) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* 1. Título no topo */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <School className="text-indigo-600" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Calculadora de classe escolar
            </h1>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Identifique a classe escolar de uma criança com base na data de nascimento e data de corte de 31 de março.
          </p>
        </header>

        {/* 2. Entradas e Botão */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Settings size={16} className="text-indigo-500" />
                Ano de Referência
              </label>
              <input
                type="number"
                value={refYear}
                onChange={(e) => setRefYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} className="text-indigo-500" />
                Data de Nascimento (DD/MM/AAAA)
              </label>
              <input
                type="text"
                placeholder="Ex: 01/01/2022"
                value={birthDateStr}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 8) val = val.slice(0, 8);
                  if (val.length > 4) {
                    val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
                  } else if (val.length > 2) {
                    val = `${val.slice(0, 2)}/${val.slice(2)}`;
                  }
                  setBirthDateStr(val);
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
              />
            </div>
          </div>

          <button
            onClick={calculateClass}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 text-xl shadow-xl shadow-indigo-100"
          >
            <Search size={24} />
            Verificar Classe
          </button>

          {/* 3. Região do Resultado logo abaixo do botão */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`mt-8 rounded-2xl p-8 border ${
                  result.includes("Muito") 
                    ? "bg-amber-50 border-amber-200 text-amber-900" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}>
                  <div className="flex items-start gap-4">
                    {result.includes("Muito") ? (
                      <AlertCircle className="text-amber-500 mt-1" size={32} />
                    ) : (
                      <CheckCircle className="text-emerald-500 mt-1" size={32} />
                    )}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">
                        Resultado da Consulta
                      </h3>
                      <p className="text-3xl font-bold mb-4">
                        {result.includes("Muito") ? result : `Classe: ${result}`}
                      </p>
                      
                      {!result.includes("Muito") && (
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100/50 w-fit px-4 py-2 rounded-full text-base font-medium">
                          <Info size={18} />
                          Idade em 31/03/{refYear}: {ageOnCutoff} ano(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Intervalos de cálculo no final */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-slate-200"></div>
            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={20} />
              Intervalos de Cálculo
            </h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {intervals.map((interval, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors group">
                <p className="text-sm font-bold text-indigo-600 mb-2 group-hover:scale-105 transition-transform origin-left">
                  {interval.name}
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="font-medium">{formatDate(interval.start)}</span>
                  <span className="opacity-30">→</span>
                  <span className="font-medium">{formatDate(interval.end)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-slate-400 text-sm text-center">
          <p>© 2026 Calculadora Escolar - Regras baseadas na data de corte de 31/03.</p>
        </footer>
      </div>
    </div>
  );
}

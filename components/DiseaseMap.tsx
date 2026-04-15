
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, AlertTriangle } from 'lucide-react';

import { Province } from '../types';

interface ProvinceRisk {
  name: Province;
  risk: 'High' | 'Medium' | 'Low';
  color: string;
}

const PROVINCES: ProvinceRisk[] = [
  { name: 'Mashonaland West', risk: 'High', color: 'bg-red-500' },
  { name: 'Mashonaland Central', risk: 'High', color: 'bg-red-500' },
  { name: 'Mashonaland East', risk: 'Medium', color: 'bg-amber-500' },
  { name: 'Manicaland', risk: 'Medium', color: 'bg-amber-500' },
  { name: 'Midlands', risk: 'Low', color: 'bg-emerald-500' },
  { name: 'Masvingo', risk: 'Low', color: 'bg-emerald-500' },
];

const DiseaseMap: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl border-4 border-slate-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Map className="text-emerald-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">National Surveillance</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Maize Outbreak Risk Index</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Updates</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <AnimatePresence>
          {PROVINCES.map((p, idx) => (
            <motion.div 
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group"
            >
            <div className={`w-4 h-4 rounded-full ${p.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform`} />
            <div className="min-w-0">
              <p className="text-xs font-black truncate leading-none mb-1">{p.name}</p>
              <p className={`text-[9px] font-bold uppercase tracking-tighter ${
                p.risk === 'High' ? 'text-red-400' : p.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{p.risk} Risk</p>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 p-4 bg-red-500/10 border-2 border-red-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
        <div className="p-2 bg-red-500 rounded-xl shadow-lg shadow-red-500/40">
          <AlertTriangle className="text-white" size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-0.5">Critical Alert</p>
          <p className="text-xs font-bold text-red-100 italic">"Fall Armyworm migration detected in Mashonaland West maize belts."</p>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none transform rotate-12">
        <Map size={240} />
      </div>
    </motion.div>
  );
};

export default DiseaseMap;

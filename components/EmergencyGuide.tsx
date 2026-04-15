
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, AlertCircle, Info } from 'lucide-react';
import { EmergencyDisease } from '../types';

const EMERGENCY_DISEASES: EmergencyDisease[] = [
  { name: 'Maize Streak Virus', crop: 'Maize', symptoms: 'Yellow streaking along leaf veins.', cure: 'No cure. Remove infected plants. Plant resistant varieties.' },
  { name: 'Fall Armyworm', crop: 'Maize / Sorghum', symptoms: 'Ragged holes in leaves, sawdust-like waste in whorls.', cure: 'Use neem oil or Emamectin benzoate (chemical).' },
  { name: 'Late Blight', crop: 'Tomato / Potato', symptoms: 'Water-soaked dark spots on leaves.', cure: 'Copper-based fungicides. Improve plant spacing.' },
  { name: 'Wheat Rust', crop: 'Wheat', symptoms: 'Orange/red pustules on leaves and stems.', cure: 'Apply systemic fungicides. Use certified seeds.' },
  { name: 'Tobacco Mosaic Virus', crop: 'Tobacco', symptoms: 'Mottled green and yellow leaves, stunted growth.', cure: 'Remove infected plants. Sanitize hands/tools.' },
  { name: 'Aphids', crop: 'Various', symptoms: 'Clusters of small insects under leaves, sticky residue.', cure: 'Soap water spray or systemic insecticides.' },
  { name: 'Groundnut Rosette', crop: 'Groundnuts', symptoms: 'Yellowing, stunting, distorted leaves.', cure: 'Early planting. Control aphid vectors.' },
  { name: 'Black Rot', crop: 'Cabbage', symptoms: 'V-shaped yellow patches on leaf edges.', cure: '3-year crop rotation. Use clean seeds.' },
  { name: 'Citrus Canker', crop: 'Citrus', symptoms: 'Raised brown spots with yellow halos on leaves/fruit.', cure: 'Remove infected branches. Spray copper fungicides.' },
  { name: 'Bean Rust', crop: 'Beans', symptoms: 'Reddish-brown spots on leaf undersides.', cure: 'Resistant varieties. Sulfur dusting.' },
];

const EmergencyGuide: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = EMERGENCY_DISEASES.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.crop.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <BookOpen className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Emergency Guide</h2>
          </div>
          <a 
            href="tel:+263242706081" 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-900/40"
          >
            <AlertCircle size={14} />
            Agritex Hotline
          </a>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search crop or disease..."
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((d, i) => (
            <motion.div 
              key={d.name}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-slate-900">{d.name}</h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase">{d.crop}</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 text-xs">
                  <AlertCircle size={14} className="text-red-500 shrink-0" />
                  <p className="text-slate-600 font-bold"><span className="text-slate-400">Symptoms:</span> {d.symptoms}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <Info size={14} className="text-sky-500 shrink-0" />
                  <p className="text-slate-600 font-bold"><span className="text-slate-400">Control:</span> {d.cure}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EmergencyGuide;

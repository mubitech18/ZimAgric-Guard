
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, ChevronRight, ShieldCheck } from 'lucide-react';
import { DiagnosisHistoryItem } from '../types';

interface HistoryBarProps {
  items: DiagnosisHistoryItem[];
  onSelectItem: (item: DiagnosisHistoryItem) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ items, onSelectItem }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <History size={20} className="text-slate-400" />
        <h3 className="font-bold text-slate-700">Recent Scans</h3>
      </div>
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onSelectItem(item)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all text-left shadow-sm group"
            >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img 
                src={`data:image/jpeg;base64,${item.image}`} 
                alt={item.diagnosis.plantName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-bold text-slate-800 truncate">{item.diagnosis.plantName}</h4>
                {item.isVerified && (
                  <div className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest flex items-center gap-0.5">
                    <ShieldCheck size={8} />
                    Verified
                  </div>
                )}
                {item.diagnosis.status === 'Diseased' && !item.isVerified && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(item.timestamp).toLocaleDateString()} • {item.diagnosis.status}
              </p>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </motion.button>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryBar;

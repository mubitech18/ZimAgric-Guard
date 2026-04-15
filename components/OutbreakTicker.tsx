
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Zap } from 'lucide-react';
import { CommunityPost } from '../types';

interface OutbreakTickerProps {
  posts: CommunityPost[];
}

const OutbreakTicker: React.FC<OutbreakTickerProps> = ({ posts }) => {
  // Logic: Find if 3 or more posts in same district have same disease
  const reportCounts: Record<string, number> = {};
  
  posts.forEach(p => {
    if (p.diagnosis.status !== 'Healthy') {
      const key = `${p.district}-${p.diagnosis.conditionName}`;
      reportCounts[key] = (reportCounts[key] || 0) + 1;
    }
  });

  const activeOutbreaks = Object.entries(reportCounts)
    .filter(([_, count]) => count >= 2)
    .map(([key]) => {
      const [district, condition] = key.split('-');
      const isVerified = posts.some(p => p.district === district && p.diagnosis.conditionName === condition && p.isVerified);
      return { district, condition, isVerified };
    });

  if (activeOutbreaks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border-2 border-emerald-100 p-3 rounded-2xl flex items-center gap-3"
      >
        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
          <Zap size={16} />
        </div>
        <p className="text-xs font-bold text-emerald-800">
          ALL CLEAR: No major outbreaks detected in your current region.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {activeOutbreaks.map((outbreak, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg animate-pulse border-4 ${
              outbreak.isVerified ? 'bg-emerald-600 border-emerald-400' : 'bg-red-600 border-red-400'
            }`}
          >
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80 leading-none mb-1">
                {outbreak.isVerified ? 'Official Agritex Alert' : 'Regional Outbreak Alert'}
              </p>
              <p className="text-sm font-bold">
                High incidence of <span className="underline decoration-2">{outbreak.condition}</span> reported in {outbreak.district} District!
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default OutbreakTicker;

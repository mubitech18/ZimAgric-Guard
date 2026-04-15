
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, AlertCircle, ShieldCheck, Beaker, Sprout, 
  Volume2, Pause, Play, MapPin, ExternalLink, Building2, 
  ArrowRight, Info
} from 'lucide-react';
import { PlantDiagnosis } from '../types';

interface DiagnosisCardProps {
  diagnosis: PlantDiagnosis;
}

type AudioState = 'idle' | 'playing' | 'paused';

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis }) => {
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [submitted, setSubmitted] = useState(false);
  const isHealthy = diagnosis.status === 'Healthy';

  useEffect(() => {
    // Cleanup speech if component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (audioState === 'playing') {
      window.speechSynthesis.pause();
      setAudioState('paused');
    } else if (audioState === 'paused') {
      window.speechSynthesis.resume();
      setAudioState('playing');
    } else {
      // Idle or starting fresh
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(diagnosis.localLanguageSummary);
      utterance.rate = 0.9;
      
      utterance.onstart = () => setAudioState('playing');
      utterance.onend = () => setAudioState('idle');
      utterance.onerror = () => setAudioState('idle');
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioState('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Summary Audio Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between border-4 border-white overflow-hidden relative">
        <div className="flex-1 z-10">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Audio Assistant</p>
          <p className="text-lg font-bold leading-tight line-clamp-2 italic">
            "{diagnosis.localLanguageSummary}"
          </p>
        </div>
        
        <div className="flex items-center gap-2 z-10 ml-4">
          <button 
            onClick={toggleAudio}
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
              audioState === 'playing' 
                ? 'bg-white text-emerald-600 scale-95 shadow-inner' 
                : 'bg-emerald-500 text-white hover:scale-105 active:scale-90 shadow-lg'
            }`}
          >
            {audioState === 'playing' ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          
          {audioState !== 'idle' && (
            <button 
              onClick={stopAudio}
              className="h-10 w-10 rounded-full bg-emerald-700/50 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors"
              title="Stop"
            >
              <div className="w-3 h-3 bg-white rounded-sm" />
            </button>
          )}
        </div>

        {/* Decorative Wave Pulse */}
        <AnimatePresence>
          {audioState === 'playing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-500/20 animate-pulse pointer-events-none" 
            />
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-100">
        <div className={`p-8 ${isHealthy ? 'bg-emerald-50' : 'bg-red-50'} border-b-2`}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-none mb-1">{diagnosis.plantName}</h2>
              <p className="text-slate-500 font-bold italic text-sm">{diagnosis.scientificName}</p>
            </div>
            <div className={`px-6 py-3 rounded-2xl text-lg font-black flex items-center gap-2 shadow-md ${
              isHealthy ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
            }`}>
              {isHealthy ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
              {diagnosis.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Expert Observation</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Leaf size={60} />
               </div>
               <p className="text-lg font-bold text-slate-700 leading-snug">
                {diagnosis.conditionName}: <span className="font-normal text-slate-600">{diagnosis.description}</span>
               </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50 rounded-3xl p-6 border-4 border-amber-100 shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <Sprout className="text-amber-700" size={28} />
                <h4 className="text-lg font-black text-amber-900">Pfumvudza (Organic)</h4>
              </div>
              <p className="text-amber-800 font-bold leading-relaxed">
                {diagnosis.organicTreatment}
              </p>
            </div>
            
            <div className="bg-sky-50 rounded-3xl p-6 border-4 border-sky-100">
              <div className="flex items-center gap-3 mb-4">
                <Beaker className="text-sky-700" size={28} />
                <h4 className="text-lg font-black text-sky-900">Chemical Cure</h4>
              </div>
              <p className="text-sky-800 font-bold leading-relaxed">
                {diagnosis.chemicalTreatment}
              </p>
            </div>
          </div>

          {diagnosis.suppliers && diagnosis.suppliers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-red-500" size={24} />
                <h3 className="text-xl font-black text-slate-800">Nearest Zim Suppliers</h3>
              </div>
              <div className="space-y-4">
                {diagnosis.suppliers.map((supplier, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl hover:border-emerald-300 transition-all shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="p-3 bg-white rounded-2xl border-2 border-slate-100">
                        <Building2 size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 leading-none mb-1">{supplier.name}</h4>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{supplier.distance}</p>
                      </div>
                    </div>
                    <a 
                      href={supplier.directionsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl border-2 border-emerald-500 text-emerald-600 shadow-md active:scale-90 transition-transform"
                    >
                      <ExternalLink size={24} />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="pt-4 border-t-2 border-slate-100">
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Immediate Field Actions</h4>
               <button 
                 onClick={() => setSubmitted(true)}
                 disabled={submitted}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   submitted 
                     ? 'bg-emerald-600 text-white shadow-lg' 
                     : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                 }`}
               >
                 <ShieldCheck size={14} />
                 {submitted ? 'Submitted to Agritex' : 'Submit for Expert Review'}
               </button>
             </div>
             <div className="space-y-3">
               {diagnosis.immediateActions.map((action, idx) => (
                 <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                   <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                     <ArrowRight size={20} />
                   </div>
                   <p className="font-bold text-slate-700">{action}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiagnosisCard;

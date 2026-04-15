
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Satellite, Map as MapIcon, QrCode, 
  Droplets, CloudRain, ThermometerSun, AlertTriangle,
  Download, CheckCircle2, Navigation, Sprout
} from 'lucide-react';
import { ScoutPin, DiagnosisHistoryItem } from '../types';

interface PrecisionHubProps {
  history: DiagnosisHistoryItem[];
}

const MOCK_PINS: ScoutPin[] = [
  { id: '1', lat: 30, lng: 40, severity: 'Critical', crop: 'Maize', issue: 'Streak Virus' },
  { id: '2', lat: 60, lng: 20, severity: 'Monitoring', crop: 'Tobacco', issue: 'Aphids' },
  { id: '3', lat: 45, lng: 70, severity: 'Healthy', crop: 'Cotton', issue: 'Normal' },
];

const PrecisionHub: React.FC<PrecisionHubProps> = ({ history }) => {
  const [showQR, setShowQR] = useState(false);

  // Calculate dynamic Pfumvudza score
  const pfumvudzaScans = history.filter(h => 
    h.diagnosis.description?.toLowerCase().includes('pfumvudza') || 
    h.diagnosis.organicTreatment?.toLowerCase().includes('mulch') ||
    h.diagnosis.organicTreatment?.toLowerCase().includes('manure')
  );
  const healthyPfumvudza = pfumvudzaScans.filter(h => h.diagnosis.status === 'Healthy').length;
  const baseScore = 65;
  const dynamicScore = Math.min(98, baseScore + (healthyPfumvudza * 8) + (pfumvudzaScans.length * 3));
  const level = dynamicScore > 90 ? 'Agritex Gold' : dynamicScore > 75 ? 'Level 3 Expert' : 'Level 2 Practitioner';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      {/* Pfumvudza Compliance Widget */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-emerald-50 rounded-[2.5rem] p-8 border-4 border-emerald-100 shadow-xl relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
              <Sprout size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Pfumvudza Score</h3>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Conservation Compliance</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-emerald-600">{dynamicScore}%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{level}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold text-slate-700">Mulching Coverage</p>
            </div>
            <p className="text-xs font-black text-emerald-600">OPTIMAL</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold text-slate-700">Pothole Depth</p>
            </div>
            <p className="text-xs font-black text-amber-600">ADJUST (15cm)</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold text-slate-700">Organic Manure</p>
            </div>
            <p className="text-xs font-black text-emerald-600">APPLIED</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-4 shadow-lg shadow-emerald-900/20">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-xs font-bold leading-snug">
            Your field is eligible for the **Agritex Gold Certification**. Generate your record below.
          </p>
        </div>
      </motion.section>

      {/* Predictive Alerts Widget */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black mb-1">Environmental Risk</h3>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Real-time Sensor Feed</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl">
            <CloudRain className="text-sky-400" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <Droplets className="text-sky-400 mb-2" size={20} />
            <p className="text-[10px] text-white/50 font-bold uppercase">Humidity</p>
            <p className="text-xl font-black">85%</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <ThermometerSun className="text-amber-400 mb-2" size={20} />
            <p className="text-[10px] text-white/50 font-bold uppercase">Temp</p>
            <p className="text-xl font-black">28°C</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <Satellite className="text-emerald-400 mb-2" size={20} />
            <p className="text-[10px] text-white/50 font-bold uppercase">Signal</p>
            <p className="text-xl font-black">4G/GPS</p>
          </div>
        </div>

        <div className="bg-red-500/20 border-2 border-red-500/40 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <p className="text-sm font-bold text-red-100">
            ⚠️ High Fungal Risk detected for your area due to high humidity and recent 24h rainfall.
          </p>
        </div>
      </motion.section>

      {/* NDVI Satellite Dashboard */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <Satellite size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">NDVI Field Health</h3>
          </div>
          <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">
            Updated 2h ago
          </span>
        </div>

        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-200 border-2 border-slate-100 shadow-inner group">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 grayscale"
            alt="Field Satellite View"
          />
          {/* NDVI Heatmap Overlay Mockup */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-emerald-500/60 to-emerald-600/40 mix-blend-overlay animate-pulse" />
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-[10px] font-black text-slate-700">
              HEALTHY: 72%
            </div>
            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-[10px] font-black text-red-600">
              STRESSED: 28%
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-[10px] font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Sentinel-2 Feed
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Field A-1 (Maize)', 'Field B-2 (Cotton)', 'Orchard North'].map((field, i) => (
            <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
              i === 0 ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'
            }`}>
              {field}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Smart-Scout Map */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-sky-100 rounded-2xl text-sky-600">
            <MapIcon size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Precision Scouting</h3>
        </div>

        <div className="relative aspect-square rounded-3xl bg-slate-50 border-2 border-slate-100 p-4 overflow-hidden flex items-center justify-center">
          {/* Stylized Grid for Scouting Map */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          {/* Mock Field Shape */}
          <div className="w-3/4 h-3/4 bg-emerald-100/50 rounded-[4rem] border-4 border-dashed border-emerald-200 flex items-center justify-center relative">
            {MOCK_PINS.map((pin) => (
              <div 
                key={pin.id}
                className="absolute group transition-transform hover:scale-125 cursor-pointer"
                style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                  pin.severity === 'Critical' ? 'bg-red-500' : 
                  pin.severity === 'Monitoring' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  <Navigation size={14} className="text-white transform rotate-45" />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                  <p className="font-black">{pin.crop}</p>
                  <p className="opacity-70">{pin.issue}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-4 right-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Mazowe Farm Sub-division #402
          </div>
        </div>
      </motion.section>

      {/* Health Certificate QR Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <QrCode size={40} />
        </div>
        <h3 className="text-2xl font-black mb-2">Health Certificate</h3>
        <p className="font-bold text-emerald-100 mb-8 max-w-xs opacity-80">
          Generate a secure summary of all field diagnoses for Agritex reporting or supply chain tracking.
        </p>
        
        <button 
          onClick={() => setShowQR(!showQR)}
          className="w-full py-4 bg-white text-emerald-600 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          {showQR ? <CheckCircle2 size={24} /> : <Download size={24} />}
          {showQR ? "CERTIFICATE READY" : "GENERATE RECORD"}
        </button>

        {showQR && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 p-6 bg-white rounded-[2rem] shadow-2xl"
          >
            <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-slate-50 relative overflow-hidden p-2">
              <div className="w-full h-full bg-slate-900 p-2 rounded-lg">
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1">
                   {Array.from({length: 36}).map((_, i) => (
                     <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`} />
                   ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
            </div>
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              ZAG-ID: {crypto.randomUUID().slice(0,8).toUpperCase()}
            </p>
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default PrecisionHub;

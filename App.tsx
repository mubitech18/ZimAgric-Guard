
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Leaf, Loader2, Sparkles, Sprout, Upload, 
  MapPin, Settings, Languages, Shovel, ShieldCheck,
  Users, Search, LayoutGrid, BarChart3, CloudOff, Cloud, Book, Image as ImageIcon
} from 'lucide-react';
import CameraView from './components/CameraView';
import DiagnosisCard from './components/DiagnosisCard';
import HistoryBar from './components/HistoryBar';
import DiseaseMap from './components/DiseaseMap';
import FarmersIndaba from './components/FarmersIndaba';
import PrecisionHub from './components/PrecisionHub';
import EmergencyGuide from './components/EmergencyGuide';
import { diagnosePlant } from './services/geminiService';
import { savePendingScan, getPendingScans, deletePendingScan } from './services/dbService';
import { PlantDiagnosis, DiagnosisHistoryItem, Language, CommunityPost, Province, PendingScan } from './types';

const STORAGE_KEY = 'zimagri_guard_history';

// MOCK DATA for Indaba
const INITIAL_INDABA_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Baba Tanaka',
    province: 'Mashonaland West',
    district: 'Mazowe',
    image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    likes: 24,
    timestamp: Date.now() - 3600000 * 2,
    diagnosis: {
      plantName: 'Maize',
      scientificName: 'Zea mays',
      status: 'Diseased',
      confidenceScore: 0.98,
      conditionName: 'Maize Streak Virus',
      description: 'Severe yellow streaking observed on young leaves.',
      immediateActions: ['Uproot infected plants immediately', 'Control leafhopper population'],
      organicTreatment: 'Intercrop with Desmodium to repel pests.',
      chemicalTreatment: 'No direct cure; use Imidacloprid for vectors.',
      preventionTips: ['Plant resistant hybrids', 'Early planting'],
      localLanguageSummary: 'Chibage chenyu chabatwa nechirwere cheStreak. Kurumidzai kubvisa zvirimwa zvabatwa.'
    },
    traditionalKnowledge: 'Burning specific local herbs around the field edges during sunrise helps deter leafhoppers.',
    comments: [
      { id: 'c1', author: 'Officer Agritex', text: 'This is a confirmed outbreak in Mazowe. All farmers must report similar sightings.', isExpert: true, timestamp: Date.now() - 3600000 * 1 }
    ]
  },
  {
    id: 'post-2',
    author: 'Amai Chipo',
    province: 'Manicaland',
    district: 'Mutare',
    image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    likes: 15,
    timestamp: Date.now() - 3600000 * 12,
    diagnosis: {
      plantName: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      status: 'Diseased',
      confidenceScore: 0.92,
      conditionName: 'Late Blight',
      description: 'Water-soaked spots on leaves turning brown and papery.',
      immediateActions: ['Remove lower leaves', 'Improve spacing for airflow'],
      organicTreatment: 'Dust with fine wood ash early in the morning.',
      chemicalTreatment: 'Apply Mancozeb or Copper-based fungicides.',
      preventionTips: ['Mulch with dry grass', 'Avoid overhead watering'],
      localLanguageSummary: 'Matoromati enyu ane chirwere cheBlight. Shandisai dota rematanda kudzivirira.'
    },
    comments: [
      { id: 'c2', author: 'Sekuru James', text: 'Ash works wonders if you catch it early!', isExpert: false, timestamp: Date.now() - 3600000 * 10 }
    ]
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'indaba' | 'precision' | 'guide'>('diagnosis');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [indabaPosts, setIndabaPosts] = useState<CommunityPost[]>(INITIAL_INDABA_POSTS);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [language, setLanguage] = useState<Language>('English');
  const [isPfumvudzaMode, setIsPfumvudzaMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        null,
        { enableHighAccuracy: true }
      );
    }

    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncPendingScans();
    }
  }, [isOnline]);

  const refreshPendingCount = async () => {
    const pending = await getPendingScans();
    setPendingCount(pending.length);
  };

  const syncPendingScans = async () => {
    const pending = await getPendingScans();
    if (pending.length === 0) return;

    for (const scan of pending) {
      try {
        const result = await diagnosePlant(scan.imageBase64, location, scan.language, scan.isPfumvudza);
        saveToHistory(result, scan.imageBase64);
        await deletePendingScan(scan.id);
      } catch (err) {
        console.error("Sync failed for", scan.id, err);
      }
    }
    refreshPendingCount();
  };

  const saveToHistory = (diagnosis: PlantDiagnosis, image: string) => {
    const newItem: DiagnosisHistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      image,
      diagnosis
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    const newPost: CommunityPost = {
      id: crypto.randomUUID(),
      author: 'Farmer Me',
      province: 'Harare',
      district: 'Harare Central',
      image,
      diagnosis,
      likes: 0,
      comments: [],
      timestamp: Date.now(),
      traditionalKnowledge: isPfumvudzaMode ? "Practicing traditional Pfumvudza mulching for this crop." : undefined
    };
    setIndabaPosts([newPost, ...indabaPosts]);
  };

  const handleCapture = async (base64Image: string) => {
    setIsCameraOpen(false);
    setError(null);

    if (!isOnline) {
      const pending: PendingScan = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageBase64: base64Image,
        isPfumvudza: isPfumvudzaMode,
        language: language
      };
      await savePendingScan(pending);
      refreshPendingCount();
      setError("Offline: Scan saved locally. It will analyze automatically when you are back online.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await diagnosePlant(base64Image, location, language, isPfumvudzaMode);
      setCurrentDiagnosis(result);
      saveToHistory(result, base64Image);
      setActiveTab('diagnosis');
    } catch (err) {
      setError("Diagnosis failed. Save for later if your connection is weak.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onloadend = () => handleCapture((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        }} 
        accept="image/*" 
        className="hidden" 
      />

      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-2xl">
        <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">ZimAgri-Guard</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Smart Zimbabwe Farm AI</p>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                   {isOnline ? <Cloud size={8} /> : <CloudOff size={8} />}
                   <span className="text-[7px] font-black uppercase">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
                {pendingCount} SYNCING
              </div>
            )}
            <button 
              onClick={() => setIsPfumvudzaMode(!isPfumvudzaMode)}
              className={`p-3 rounded-2xl transition-all border-2 ${
                isPfumvudzaMode ? 'bg-amber-500 border-amber-300 text-white scale-110 shadow-lg shadow-amber-500/20' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Pfumvudza Mode"
            >
              <Shovel size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b-2 border-slate-100 overflow-x-auto no-scrollbar">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center gap-4">
          <Languages size={18} className="text-slate-400 shrink-0" />
          {(['English', 'Shona', 'Ndebele'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-black transition-all border-2 ${
                language === lang ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'diagnosis' ? (
              <>
                {!isAnalyzing && !currentDiagnosis && !error && (
                  <div className="space-y-8">
                    <div className="text-center py-8">
                      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Leaf className="text-emerald-600" size={48} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Protect Your Harvest</h2>
                      <p className="text-slate-500 font-bold mb-8">
                        Scan your maize, tobacco, or vegetables for instant Zim-expert advice.
                      </p>
                      
                      {/* Primary Action Group */}
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setIsCameraOpen(true)}
                          className="bg-emerald-600 text-white py-6 rounded-3xl font-black flex flex-col items-center gap-3 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                        >
                          <Plus size={32} />
                          <span className="text-sm">Capture Live</span>
                        </button>
                        <button 
                          onClick={triggerUpload}
                          className="bg-white border-2 border-slate-100 text-slate-800 py-6 rounded-3xl font-black flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all"
                        >
                          <Upload size={32} className="text-emerald-600" />
                          <span className="text-sm">From Gallery</span>
                        </button>
                      </div>
                    </div>

                    <DiseaseMap />

                    <div className="bg-amber-100 border-4 border-amber-200 p-6 rounded-3xl flex items-start gap-4">
                      <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-md">
                        <Shovel size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-amber-900 text-lg">Pfumvudza Mode {isPfumvudzaMode ? 'ON' : 'OFF'}</h4>
                        <p className="text-sm font-bold text-amber-800/80 leading-snug">
                          {isPfumvudzaMode 
                            ? "Prioritizing organic mulching, wood ash, and traditional crop health boosters."
                            : "Toggle the shovel icon above to prioritize traditional organic methods."}
                        </p>
                      </div>
                    </div>
                    
                    <HistoryBar 
                      items={history} 
                      onSelectItem={(item) => {
                        setCurrentDiagnosis(item.diagnosis);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                    />
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                      <Loader2 className="animate-spin text-emerald-600 h-20 w-20 stroke-[3px]" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Consulting Botanist...</h3>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Locating local Zim suppliers</p>
                  </div>
                )}

                {error && (
                  <div className="bg-emerald-600 text-white p-8 rounded-[2rem] shadow-2xl text-center space-y-6">
                    <div className="flex justify-center">
                       <div className="p-4 bg-white/20 rounded-full">
                         <CloudOff size={48} />
                       </div>
                    </div>
                    <h3 className="text-2xl font-black">Resilient Mode Active</h3>
                    <p className="font-bold opacity-90">{error}</p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setError(null)}
                        className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-lg shadow-xl"
                      >
                        OK, Got It
                      </button>
                      <button 
                        onClick={() => setActiveTab('guide')}
                        className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm border-2 border-emerald-500"
                      >
                        Open Emergency Guide
                      </button>
                    </div>
                  </div>
                )}

                {currentDiagnosis && !isAnalyzing && (
                  <div className="space-y-6">
                    <DiagnosisCard diagnosis={currentDiagnosis} />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setCurrentDiagnosis(null)}
                        className="flex-1 py-4 bg-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-300 transition-colors"
                      >
                        Done
                      </button>
                      <button 
                        onClick={triggerUpload}
                        className="flex-1 py-4 bg-white border-2 border-slate-200 text-emerald-600 rounded-2xl font-black flex items-center justify-center gap-2"
                      >
                        <Upload size={18} />
                        New Photo
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : activeTab === 'indaba' ? (
              <FarmersIndaba posts={indabaPosts} currentLanguage={language} />
            ) : activeTab === 'precision' ? (
              <PrecisionHub history={history} />
            ) : (
              <EmergencyGuide />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t-2 border-slate-100 z-40">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              activeTab === 'diagnosis' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <LayoutGrid size={22} fill={activeTab === 'diagnosis' ? 'currentColor' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">Doctor</span>
          </button>

          <button
            onClick={() => setActiveTab('indaba')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              activeTab === 'indaba' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <Users size={22} fill={activeTab === 'indaba' ? 'currentColor' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">Indaba</span>
          </button>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex-shrink-0 h-16 w-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/40 border-4 border-white active:scale-90 transition-transform -mt-2"
          >
            <Plus size={32} strokeWidth={3} />
          </button>

          <button
            onClick={() => setActiveTab('precision')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              activeTab === 'precision' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <BarChart3 size={22} fill={activeTab === 'precision' ? 'currentColor' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">Precision</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              activeTab === 'guide' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <Book size={22} fill={activeTab === 'guide' ? 'currentColor' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">Guide</span>
          </button>
        </div>
      </div>

      {isCameraOpen && (
        <CameraView 
          onCapture={handleCapture} 
          onClose={() => setIsCameraOpen(false)}
          onUpload={triggerUpload}
          isPfumvudza={isPfumvudzaMode}
          onTogglePfumvudza={() => setIsPfumvudzaMode(!isPfumvudzaMode)}
        />
      )}
    </div>
  );
};

export default App;

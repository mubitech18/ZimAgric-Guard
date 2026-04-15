
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Info, PlusCircle, Search } from 'lucide-react';
import IndabaPost from './IndabaPost';
import OutbreakTicker from './OutbreakTicker';
import { CommunityPost, Language } from '../types';

interface FarmersIndabaProps {
  posts: CommunityPost[];
  currentLanguage: Language;
}

const FarmersIndaba: React.FC<FarmersIndabaProps> = ({ posts, currentLanguage }) => {
  const [filter, setFilter] = useState('');
  const [showEldersOnly, setShowEldersOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesFilter = post.province.toLowerCase().includes(filter.toLowerCase()) || 
                         post.diagnosis.plantName.toLowerCase().includes(filter.toLowerCase());
    const matchesElders = showEldersOnly ? !!post.traditionalKnowledge : true;
    const matchesVerified = showVerifiedOnly ? !!post.isVerified : true;
    return matchesFilter && matchesElders && matchesVerified;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-900/20">
              <Users size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Farmer's Indaba</h2>
          </div>
          <p className="text-slate-500 font-bold leading-tight">
            Connect with local growers and share traditional knowledge.
          </p>
        </div>

        <OutbreakTicker posts={posts} />

        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Filter by Province or Crop..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-800 focus:outline-none focus:border-emerald-400 shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => { setShowEldersOnly(false); setShowVerifiedOnly(false); }}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                !showEldersOnly && !showVerifiedOnly ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              General Feed
            </button>
            <button 
              onClick={() => { setShowEldersOnly(true); setShowVerifiedOnly(false); }}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                showEldersOnly ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'
              }`}
            >
              Ask the Elders
            </button>
            <button 
              onClick={() => { setShowVerifiedOnly(true); setShowEldersOnly(false); }}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                showVerifiedOnly ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'
              }`}
            >
              Verified Only
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <IndabaPost post={post} currentLanguage={currentLanguage} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
              </div>
              <p className="font-black text-slate-400">No matching posts found in {filter}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-20" /> {/* Extra space for bottom nav */}
    </motion.div>
  );
};

export default FarmersIndaba;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageSquare, ShieldCheck, MapPin, 
  ArrowRight, Sprout, Languages, History 
} from 'lucide-react';
import { CommunityPost, Language } from '../types';
import { translateText } from '../services/geminiService';

interface IndabaPostProps {
  post: CommunityPost;
  currentLanguage: Language;
}

const IndabaPost: React.FC<IndabaPostProps> = ({ post, currentLanguage }) => {
  const [translatedContent, setTranslatedContent] = useState<string>(post.diagnosis.conditionName);
  const [isTranslating, setIsTranslating] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const handleTranslation = async () => {
      if (currentLanguage === 'English') {
        setTranslatedContent(post.diagnosis.conditionName);
        return;
      }
      setIsTranslating(true);
      try {
        const result = await translateText(post.diagnosis.conditionName, currentLanguage);
        setTranslatedContent(result);
      } finally {
        setIsTranslating(false);
      }
    };
    handleTranslation();
  }, [currentLanguage, post.diagnosis.conditionName]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl">
            {post.author[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 leading-none">{post.author}</h4>
              {post.isVerified && (
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                  <ShieldCheck size={10} />
                  Verified by Agritex
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              <MapPin size={10} />
              {post.district}, {post.province}
            </div>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-300">
          {new Date(post.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Image & Main Info */}
      <div className="relative aspect-[4/3] bg-slate-100">
        <img 
          src={`data:image/jpeg;base64,${post.image}`} 
          alt={post.diagnosis.plantName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Diagnosis Result</p>
                <h3 className="text-xl font-black text-slate-900 leading-none">
                  {isTranslating ? '...' : translatedContent}
                </h3>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-white ${
                post.diagnosis.status === 'Healthy' ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {post.diagnosis.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Knowledge Section */}
      {post.traditionalKnowledge && (
        <div className="mx-6 mt-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-100 flex gap-3 items-start">
          <History className="text-amber-600 shrink-0" size={18} />
          <div>
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Ask the Elders Tip</p>
            <p className="text-sm font-bold text-amber-900/80 leading-snug italic">
              "{post.traditionalKnowledge}"
            </p>
          </div>
        </div>
      )}

      {/* Comments / Experts */}
      <div className="p-6 space-y-4">
        {post.comments.map(comment => (
          <div key={comment.id} className={`flex gap-3 ${comment.isExpert ? 'bg-emerald-50 p-4 rounded-2xl border border-emerald-100' : ''}`}>
            {comment.isExpert && (
              <div className="shrink-0 w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <ShieldCheck size={18} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-black text-slate-800 text-xs">{comment.author}</span>
                {comment.isExpert && <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Verified Expert</span>}
              </div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              hasLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-black">{likes}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl">
            <MessageSquare size={18} />
            <span className="text-xs font-black">{post.comments.length} Advice</span>
          </button>
          <div className="flex-1" />
          <button className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
            <Languages size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default IndabaPost;

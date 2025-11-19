import React, { useEffect, useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { ResearchItem, OWNER_NAME } from '../types';

interface FullTextModalProps {
  item: ResearchItem | null;
  onClose: () => void;
}

export const FullTextModal: React.FC<FullTextModalProps> = ({ item, onClose }) => {
  const [watermarkTime, setWatermarkTime] = useState('');

  useEffect(() => {
    if (item) {
      const now = new Date();
      setWatermarkTime(now.toLocaleString());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn overflow-hidden select-none" onContextMenu={(e) => e.preventDefault()}>
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="pr-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-2">
              {item.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-[#3aa0f4]" />
                <span className="font-medium">{item.authors}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-[#3aa0f4]" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto relative bg-[#fdfdfd]">
          {/* Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-center opacity-[0.03]">
             {Array.from({ length: 10 }).map((_, i) => (
               <div key={i} className="transform -rotate-45 text-4xl font-black text-black whitespace-nowrap my-12">
                 {OWNER_NAME} — CONFIDENTIAL — {watermarkTime}
               </div>
             ))}
          </div>

          <div className="relative z-10 text-lg text-slate-700 leading-8 font-light space-y-6 max-w-3xl mx-auto">
            {item.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 uppercase tracking-widest">
          Protected Content • Do Not Copy • {OWNER_NAME}
        </div>
      </div>
    </div>
  );
};

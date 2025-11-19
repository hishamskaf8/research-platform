import React from 'react';
import { ArrowRight, Microscope } from 'lucide-react';
import { OWNER_NAME } from '../types';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#a0e9d0] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#3aa0f4] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-3xl animate-fadeInUp">
        <div className="flex justify-center mb-8">
           <div className="p-4 bg-white rounded-full shadow-xl shadow-[#3aa0f4]/10">
             <Microscope className="h-16 w-16 text-[#2ab7ca]" />
           </div>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 tracking-tight mb-6">
          Advancing Medical Science
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-600 mb-2 font-medium">
          The Personal Research Library of
        </p>
        
        <p className="text-2xl sm:text-3xl text-[#3aa0f4] font-bold mb-10">
          {OWNER_NAME}
        </p>
        
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 text-lg">
          Welcome to a dedicated repository of innovative research findings, medical studies, and scientific observations. Access is restricted to viewing mode for guest researchers and students.
        </p>
        
        <button
          onClick={onEnter}
          className="group bg-gradient-to-r from-[#2ab7ca] to-[#3aa0f4] text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center mx-auto space-x-3"
        >
          <span>Enter Library</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

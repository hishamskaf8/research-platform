import React from 'react';
import { Calendar, Users, FileText, Trash2, Eye, Pencil } from 'lucide-react';
import { ResearchItem } from '../types';

interface ResearchCardProps {
  item: ResearchItem;
  isOwner: boolean;
  onView: (item: ResearchItem) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ResearchItem) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ item, isOwner, onView, onDelete, onEdit }) => {
  // Get first 200 words for preview
  const previewText = item.content.split(/\s+/).slice(0, 40).join(' ') + '...';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col overflow-hidden group transform hover:-translate-y-1">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2ab7ca] bg-[#e0f7f4] px-2 py-1 rounded-md uppercase tracking-wider">
            <FileText className="h-3 w-3" />
            <span>Research Paper</span>
          </div>
          
          {/* View Counter Badge */}
          <div className="flex items-center space-x-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-sm" title="Total Views/Reads">
             <Eye className="h-3.5 w-3.5 text-[#3aa0f4]" />
             <span>{item.views || 0} Reads</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-[#3aa0f4] transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center space-x-2 mb-4 text-slate-500 text-sm">
          <Users className="h-4 w-4" />
          <span className="font-medium text-slate-600">{item.authors}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 text-slate-400 text-xs">
           <Calendar className="h-3 w-3" />
           <span>{item.date}</span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 border-t border-slate-100 pt-4">
          {previewText}
        </p>
      </div>

      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <button
          onClick={() => onView(item)}
          className="flex items-center space-x-2 text-[#3aa0f4] font-semibold text-sm hover:text-[#2ab7ca] transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>Read Full Paper</span>
        </button>

        {isOwner && (
          <div className="flex items-center space-x-2">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Research"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Immediate deletion without confirmation
                onDelete(item.id);
              }}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Permanently Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

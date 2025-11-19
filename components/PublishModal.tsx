import React, { useState, useEffect } from 'react';
import { X, Upload, Type, User, Calendar, Save } from 'lucide-react';
import { ResearchItem, OWNER_NAME } from '../types';
import { addResearch, updateResearch } from '../services/storageService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ResearchItem) => void;
  editingItem?: ResearchItem | null;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onSave, editingItem }) => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState(OWNER_NAME);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  // Populate form when editingItem changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setTitle(editingItem.title);
        setAuthors(editingItem.authors);
        setDate(editingItem.date);
        setContent(editingItem.content);
      } else {
        // Reset to default for new items
        setTitle('');
        setAuthors(OWNER_NAME);
        setDate(new Date().toISOString().split('T')[0]);
        setContent('');
      }
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newItem: ResearchItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      title,
      authors,
      date,
      content,
      // Preserve existing views if editing, otherwise 0
      views: editingItem ? (editingItem.views || 0) : 0,
    };

    if (editingItem) {
      updateResearch(newItem);
    } else {
      addResearch(newItem);
    }
    
    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-[#2ab7ca] to-[#3aa0f4] p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            {editingItem ? <Save className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
            <span>{editingItem ? 'Edit Research' : 'Publish New Research'}</span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Type className="h-4 w-4 text-[#2ab7ca]" /> Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
              placeholder="Enter research title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <User className="h-4 w-4 text-[#2ab7ca]" /> Authors
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2ab7ca]" /> Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
            <textarea
              required
              rows={10}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all resize-none"
              placeholder="Paste or type the full research text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2ab7ca] to-[#3aa0f4] text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {editingItem ? 'Save Changes' : 'Publish Research'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
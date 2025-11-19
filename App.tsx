import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ResearchCard } from './components/ResearchCard';
import { FullTextModal } from './components/FullTextModal';
import { LoginModal } from './components/LoginModal';
import { PublishModal } from './components/PublishModal';
import { SettingsModal } from './components/SettingsModal';
import { ResearchItem } from './types';
import { getResearch, deleteResearch, incrementViews } from './services/storageService';
import { Plus, Check } from 'lucide-react';

const App: React.FC = () => {
  // State Management
  const [view, setView] = useState<'landing' | 'library'>('landing');
  const [isOwner, setIsOwner] = useState(false);
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  
  // UI Feedback
  const [toast, setToast] = useState<string | null>(null);
  
  // Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);

  // Initialize Data
  useEffect(() => {
    const data = getResearch();
    setResearchList(data);
  }, []);

  // Security: Disable Context Menu (Right Click)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Toast helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLoginSuccess = () => {
    setIsOwner(true);
    if (view === 'landing') setView('library');
    showToast("Welcome back, Owner");
  };

  const handleLogout = () => {
    setIsOwner(false);
    setView('landing');
    showToast("Logged out successfully");
  };

  const handleDelete = (id: string) => {
    const updated = deleteResearch(id);
    setResearchList(updated);
    showToast("Item permanently deleted");
  };

  const handleEdit = (item: ResearchItem) => {
    setEditingItem(item);
    setShowPublish(true);
  };

  const handleViewResearch = (item: ResearchItem) => {
    // 1. Increment views in database
    const updatedList = incrementViews(item.id);
    setResearchList(updatedList);

    // 2. Find the updated item to display (with new view count)
    const updatedItem = updatedList.find(i => i.id === item.id) || item;
    
    // 3. Open modal
    setSelectedResearch(updatedItem);
  };

  const handleSave = (savedItem: ResearchItem) => {
    setResearchList(prev => {
      const exists = prev.find(p => p.id === savedItem.id);
      if (exists) {
        return prev.map(p => p.id === savedItem.id ? savedItem : p);
      }
      return [savedItem, ...prev];
    });
    showToast("Research saved to database");
  };

  const handleRestoreSuccess = () => {
    const data = getResearch();
    setResearchList(data);
    showToast("Database restored successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-white to-[#c2e0f7] select-none selection:bg-transparent relative">
      <Header
        isOwner={isOwner}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        onHomeClick={() => setView('landing')}
        onSettingsClick={() => setShowSettings(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'landing' ? (
          <LandingPage onEnter={() => setView('library')} />
        ) : (
          <div className="animate-fadeIn">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h2 className="text-3xl font-bold text-slate-800">Research Library</h2>
                 <p className="text-slate-500 mt-1">Explore {researchList.length} published papers</p>
               </div>
               
               {isOwner && (
                 <button
                   onClick={() => {
                     setEditingItem(null);
                     setShowPublish(true);
                   }}
                   className="flex items-center space-x-2 bg-[#3aa0f4] hover:bg-[#2ab7ca] text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                 >
                   <Plus className="h-5 w-5" />
                   <span>Publish New</span>
                 </button>
               )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
               {researchList.map((item) => (
                 <ResearchCard
                   key={item.id}
                   item={item}
                   isOwner={isOwner}
                   onView={handleViewResearch}
                   onDelete={handleDelete}
                   onEdit={handleEdit}
                 />
               ))}
             </div>
             
             {researchList.length === 0 && (
                <div className="text-center py-20 opacity-50">
                  <p className="text-xl">No research papers found.</p>
                </div>
             )}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn z-[200]">
          <Check className="h-5 w-5 text-green-400" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <PublishModal
        isOpen={showPublish}
        onClose={() => {
          setShowPublish(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editingItem={editingItem}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onRestoreSuccess={handleRestoreSuccess}
      />

      <FullTextModal
        item={selectedResearch}
        onClose={() => setSelectedResearch(null)}
      />
    </div>
  );
};

export default App;
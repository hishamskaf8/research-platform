import React, { useState, useRef } from 'react';
import { KeyRound, X, CheckCircle, AlertCircle, Database, Download, Upload, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { getPassword, updatePassword, getRawDatabase, restoreDatabase } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onRestoreSuccess }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'data'>('security');
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility State
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  // Data State
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    const storedPassword = getPassword();
    if (currentPassword !== storedPassword) {
      setPassError("Incorrect current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setPassError("Password must be at least 4 characters long.");
      return;
    }

    updatePassword(newPassword);
    setPassSuccess(true);
    
    // Clear fields and reset visibility
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleDownload = () => {
    const data = getRawDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imene_research_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreDatabase(content);
      if (success) {
        onRestoreSuccess();
        onClose();
      } else {
        setRestoreError("Invalid backup file. Restoration failed.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-fadeIn overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#3aa0f4]" />
            Owner Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-48 bg-slate-50 border-r border-slate-100 p-4 flex flex-row md:flex-col gap-2">
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'security' 
                  ? 'bg-white text-[#3aa0f4] shadow-sm border border-slate-100' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="h-4 w-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'data' 
                  ? 'bg-white text-[#3aa0f4] shadow-sm border border-slate-100' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="h-4 w-4" />
              Database
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'security' && (
              <div className="animate-fadeIn">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Change Password</h4>
                
                {passSuccess ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span>Password updated successfully!</span>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                    {passError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {passError}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] outline-none transition-all"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3aa0f4] transition-colors"
                        >
                          {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] outline-none transition-all"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3aa0f4] transition-colors"
                        >
                          {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New</label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] outline-none transition-all"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3aa0f4] transition-colors"
                        >
                          {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#3aa0f4] hover:bg-[#2ab7ca] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm mt-2"
                    >
                      Update Password
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'data' && (
              <div className="animate-fadeIn space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Database Management</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Download a backup of all your research data to ensure it is permanently saved. 
                    You can restore this file later if you clear your browser cache or move to a new device.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-[#3aa0f4] hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Download className="h-6 w-6 text-[#3aa0f4]" />
                    </div>
                    <span className="font-semibold text-slate-700">Backup Data</span>
                    <span className="text-xs text-slate-400 mt-1">Download JSON file</span>
                  </button>

                  <button
                    onClick={handleRestoreClick}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-[#2ab7ca] hover:bg-teal-50/50 transition-all group"
                  >
                    <div className="bg-teal-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-[#2ab7ca]" />
                    </div>
                    <span className="font-semibold text-slate-700">Restore Data</span>
                    <span className="text-xs text-slate-400 mt-1">Upload JSON file</span>
                    <input 
                        type="file" 
                        accept=".json"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                  </button>
                </div>

                {restoreError && (
                   <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {restoreError}
                   </div>
                )}

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                   <p className="text-xs text-amber-800 font-medium flex gap-2">
                     <AlertCircle className="h-4 w-4" />
                     Note: Restoring a database will overwrite all current research items.
                   </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
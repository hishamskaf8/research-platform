import React, { useState } from 'react';
import { KeyRound, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getPassword, updatePassword } from '../services/storageService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verify current password
    const storedPassword = getPassword();
    if (currentPassword !== storedPassword) {
      setError("Incorrect current password.");
      return;
    }

    // Verify new passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Verify strength (optional simple check)
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    // Save
    updatePassword(newPassword);
    setSuccess(true);

    // Close after brief delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="bg-blue-100 p-2 rounded-lg">
                <KeyRound className="h-6 w-6 text-[#3aa0f4]" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">Password Updated</h4>
              <p className="text-slate-500">Your access credentials have been changed successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1 mt-4">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#3aa0f4] focus:ring-2 focus:ring-[#3aa0f4]/20 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3aa0f4] hover:bg-[#2ab7ca] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all mt-4"
              >
                Update Credentials
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
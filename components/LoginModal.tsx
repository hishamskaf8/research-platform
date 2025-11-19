import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { getPassword } from '../services/storageService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = getPassword();
    
    if (password === storedPassword) {
      onLoginSuccess();
      setPassword('');
      setError(false);
      setShowPassword(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-50 p-3 rounded-full mb-3">
            <Lock className="h-8 w-8 text-[#3aa0f4]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Owner Access</h3>
          <p className="text-slate-500 text-sm text-center mt-1">Enter your secure password to manage research.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              autoFocus
              className={`w-full pl-4 pr-12 py-3 text-center rounded-lg border-2 ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-[#3aa0f4]'} outline-none transition-all`}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3aa0f4] transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {error && <p className="text-red-500 text-xs text-center mb-4 -mt-2">Incorrect password. Try again.</p>}
          
          <button
            type="submit"
            className="w-full bg-[#3aa0f4] hover:bg-[#2ab7ca] text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
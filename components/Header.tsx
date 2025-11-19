import React from 'react';
import { Stethoscope, User, LogOut, LogIn, Settings } from 'lucide-react';
import { OWNER_NAME } from '../types';

interface HeaderProps {
  isOwner: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isOwner, 
  onLoginClick, 
  onLogoutClick, 
  onHomeClick,
  onSettingsClick 
}) => {
  return (
    <header className="bg-gradient-to-r from-[#2ab7ca] to-[#3aa0f4] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none group"
          onClick={onHomeClick}
        >
          <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Stethoscope className="h-6 w-6 text-[#2ab7ca]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide drop-shadow-sm">Research Platform</h1>
            <p className="text-xs text-blue-50 opacity-90 font-medium tracking-wider">IMENE AHMED OMAR</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center">
          {isOwner ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm font-medium">{OWNER_NAME}</span>
              </div>
              
              <button
                onClick={onSettingsClick}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white backdrop-blur-sm"
                title="Settings & Database"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={onLogoutClick}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-200 px-2"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Owner Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
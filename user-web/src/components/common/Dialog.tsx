import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-start overflow-y-auto pt-20 pb-8 px-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200/80 dark:border-slate-800/60 flex flex-col animate-rise-in transform-gpu">
        <div className="shrink-0 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800/80 px-7 py-5 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-xl transition-all hover:rotate-90 duration-300 group"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white" />
          </button>
        </div>
        
        <div className="flex-1 px-7 py-6 overflow-visible">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;

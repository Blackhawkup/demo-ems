import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useEMS();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    info: 'border-blue-200 bg-blue-50/95 text-blue-950',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm max-w-md ${borderColors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium leading-snug">{toast.text}</p>
      </div>
    </div>
  );
};

import React from 'react';
import { useOS } from '../context/OSContext';
import { X } from 'lucide-react';

export const NotificationCenter = () => {
  const { notifications, removeNotification } = useOS();

  return (
    <div className="fixed top-4 right-4 z-[9900] space-y-2 max-w-xs sm:max-w-sm w-full pointer-events-none select-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-slate-900/90 border border-amber-500/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-start gap-3 transform transition-all duration-300 animate-slideDown"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
            {n.icon}
          </div>
          <div className="flex-1 space-y-0.5 min-w-0">
            <h4 className="font-bold text-xs text-amber-400 truncate">{n.title}</h4>
            <p className="text-xs text-slate-200 leading-snug">{n.message}</p>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

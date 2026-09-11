import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Folder, FileText, ArrowLeft, HardDrive, AlertCircle } from 'lucide-react';

const FOLDERS = [
  { name: 'Important', size: '0 Items', icon: '📁' },
  { name: 'Very Important', size: '0 Items', icon: '📁' },
  { name: 'Extremely Important', size: '0 Items', icon: '📁' },
  { name: "Don't Open", size: '🔒 Classified', icon: '📁' },
  { name: 'Old Trolls', size: '14 Clips', icon: '📁' },
  { name: 'Exam Notes', size: '0 Bytes', icon: '📁' },
  { name: 'Exam Notes FINAL', size: '0 Bytes', icon: '📁' },
  { name: 'Exam Notes FINAL 2', size: '0 Bytes', icon: '📁' },
  { name: 'Exam Notes FINAL REAL', size: '0 Bytes', icon: '📁' }
];

export const FileManagerApp = () => {
  const { playSound } = useOS();
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleOpenFolder = (folderName) => {
    playSound('click');
    setSelectedFolder(folderName);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Top Breadcrumb Header */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0 text-xs">
        <div className="flex items-center gap-2">
          {selectedFolder && (
            <button
              onClick={() => { playSound('click'); setSelectedFolder(null); }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <HardDrive className="w-4 h-4 text-amber-500" />
          <span className="font-mono text-slate-400">
            My Files / {selectedFolder ? selectedFolder : 'Root'}
          </span>
        </div>
        <span className="text-slate-500 font-mono">Drive C: (0 KB used)</span>
      </div>

      {/* Grid Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        {selectedFolder ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl shadow-inner">
              📂
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-xl font-bold text-amber-400">
                Folder is empty.
              </h3>
              <p className="text-sm text-slate-300 font-medium italic">
                “You already knew this.”
              </p>
              <p className="text-xs text-slate-500 pt-2">
                MalayaliOS File Manager System
              </p>
            </div>
            <button
              onClick={() => setSelectedFolder(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-300 cursor-pointer"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {FOLDERS.map((f, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenFolder(f.name)}
                className="group p-4 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center space-y-2 shadow-md hover:-translate-y-1"
              >
                <div className="text-4xl transform group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div className="space-y-0.5 w-full">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-amber-400 truncate">
                    {f.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">{f.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

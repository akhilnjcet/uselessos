import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';

export const NothingApp = () => {
  const { playSound, addNotification } = useOS();
  const [deletedFiles, setDeletedFiles] = useState([
    'രഹസ്യ രേഖകൾ.pdf',
    'Old Screenshots.png',
    'Ex-friend details.txt'
  ]);
  const [feelingsMsg, setFeelingsMsg] = useState('ഇവിടെ ഒന്നുമില്ല.');

  const handleDeleteFile = (fileName) => {
    playSound('click');
    setDeletedFiles((prev) => prev.filter((f) => f !== fileName));
    comedyAudio.play('trashDelete');
    addNotification('🗑️ Trash Bin', '“എന്നെ എന്തിനാ കളഞ്ഞത്? 😭”', '😭');
    setFeelingsMsg('“എന്നെ എന്തിനാ കളഞ്ഞത്? 😭”');
  };

  const handleEmptyTrash = () => {
    playSound('click');
    setDeletedFiles([]);
    comedyAudio.play('trashEmpty');
    addNotification('🗑️ Trash Bin', '“അയ്യോ... എല്ലാം പോയി!”', '💥');
    setFeelingsMsg('“അയ്യോ... എല്ലാം പോയി!”');
  };

  const handleInspectTrash = () => {
    playSound('click');
    if (deletedFiles.length === 0) {
      comedyAudio.play('trashOpenEmpty');
      addNotification('🗑️ Trash Bin', '“ഇവിടെ ഒന്നുമില്ല.”', '🗑️');
      setFeelingsMsg('“ഇവിടെ ഒന്നുമില്ല.”');
    } else {
      comedyAudio.play('trashMultiple');
      addNotification('🗑️ Trash Bin', '“ഇവിടെ ആരും safe അല്ല.”', '⚠️');
      setFeelingsMsg('“ഇവിടെ ആരും safe അല്ല.”');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto custom-scrollbar select-none space-y-6">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl">
            🗑️
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">🗑️ Trash Bin with Feelings</h2>
            <p className="text-xs text-slate-400">Emotional Garbage Disposal System</p>
          </div>
        </div>
        {deletedFiles.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-300 font-bold text-xs rounded-xl border border-red-700/60 cursor-pointer"
          >
            Empty Trash
          </button>
        )}
      </div>

      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold text-amber-400">TRASH CONTENTS</span>
          <span className="text-[10px] text-slate-500">{deletedFiles.length} items</span>
        </div>

        {deletedFiles.length > 0 ? (
          <ul className="space-y-2">
            {deletedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl text-xs border border-slate-800">
                <span className="text-slate-300 font-mono">📄 {file}</span>
                <button
                  onClick={() => handleDeleteFile(file)}
                  className="px-2 py-1 bg-red-950 text-red-400 hover:bg-red-900 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete Forever
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            Trash bin is completely empty.
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <h4 className="text-xs text-slate-400 font-mono uppercase">Trash Sentiment:</h4>
        <p className="text-sm font-bold text-amber-300 italic">
          {feelingsMsg}
        </p>
        <button
          onClick={handleInspectTrash}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer mt-2"
        >
          TALK TO TRASH BIN
        </button>
      </div>
    </div>
  );
};

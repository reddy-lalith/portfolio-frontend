"use client";

import React, { useEffect, useState } from 'react';

export default function LeetpuzzleHighlight() {
  const [visible, setVisible] = useState(false);
  const [pieceInPlace, setPieceInPlace] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 800); // Entrance delay
    setTimeout(() => setPieceInPlace(true), 2000); // Snap piece after 2s
  }, []);

  // Puzzle pieces
  const pieces = [
    { text: 'a > b ? a : b', correct: true },
    { text: 'a + b', correct: false },
    { text: 'a - b', correct: false },
  ];

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
      style={{ maxWidth: 400 }}
    >
      <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden group">
        {/* Animated glowing border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-purple-400 transition-colors duration-500" style={{boxShadow: '0 0 32px 4px rgba(168,85,247,0.25)'}} />
        {/* LIVE badge */}
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-600/80 text-white rounded-full shadow-md animate-pulse">
          LIVE
        </span>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-start gap-2">
          <h3 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tight">leetpuzzle</h3>
          <p className="text-sm text-gray-200/90 mb-2">LeetCode-style drag & drop puzzle.</p>
          {/* Code with blank */}
          <div className="w-full bg-black/40 rounded-lg px-4 py-3 mt-2 font-mono text-base text-purple-100 shadow-inner border border-white/10 flex flex-col gap-2">
            <span><span className="text-green-400">function</span> <span className="text-blue-300">max</span>(a, b) {'{'}</span>
            <span className="pl-6">
              <span className="text-purple-200">return</span> 
              <span className="inline-block align-middle mx-2 relative" style={{ minWidth: 110 }}>
                <span className={`inline-block h-8 px-3 rounded-lg border-2 border-purple-400 bg-white/20 transition-all duration-700
                  ${pieceInPlace ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'bg-white/20 text-purple-200 border-purple-400'}
                `}>
                  {pieceInPlace ? pieces[0].text : <span className="opacity-60">[ blank ]</span>}
                </span>
                {/* Animate the piece sliding in */}
                {!pieceInPlace && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-blink inline-block" />
                  </span>
                )}
              </span>;
            </span>
            <span>{'}'}</span>
          </div>
          {/* Puzzle pieces row */}
          <div className="flex gap-3 mt-4">
            {pieces.map((piece, i) => (
              <span
                key={piece.text}
                className={`inline-block px-4 py-2 rounded-lg font-mono text-base border-2 transition-all duration-700 cursor-pointer select-none
                  ${piece.correct
                    ? pieceInPlace
                      ? 'bg-purple-500 text-white border-purple-500 shadow-lg scale-90 opacity-60'
                      : 'bg-white/20 text-purple-200 border-purple-400 hover:bg-purple-400/60 hover:text-white hover:border-purple-400'
                    : 'bg-white/10 text-purple-200 border-white/10 hover:bg-white/20'}
                  ${piece.correct && !pieceInPlace ? 'animate-slide-to-blank' : ''}
                `}
                style={piece.correct && !pieceInPlace ? { position: 'relative', zIndex: 10 } : {}}
              >
                {piece.text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes slide-to-blank {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          80% { transform: translateY(-40px) scale(1.1); opacity: 1; }
          100% { transform: translateY(-70px) scale(0.9); opacity: 0; }
        }
        .animate-slide-to-blank {
          animation: slide-to-blank 1.2s cubic-bezier(.4,2,.6,1) forwards;
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  );
} 
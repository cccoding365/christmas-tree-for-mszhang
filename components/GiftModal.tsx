
import React from 'react';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorations */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6 font-sans">A Special Message for {name}</h2>
          
          <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10">
            <img 
              src="https://picsum.photos/seed/christmas/600/400" 
              alt="Our Moments" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="space-y-4 text-white/90 text-left leading-relaxed font-sans italic">
            <p>
              Hi there! On this magical snowy Christmas, I wanted to send a piece of my heart to you.
            </p>
            <p>
              Meeting you has been the greatest gift of my year. Thank you for your warmth and companionship. 
              I hope we can spend every future Christmas together, holding hands in the snow and listening to our favorite songs.
            </p>
            <p className="text-right font-bold text-pink-300 not-italic">
              — Forever Yours
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-500/25 transition-all uppercase tracking-wider"
          >
            Accept with Love
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;

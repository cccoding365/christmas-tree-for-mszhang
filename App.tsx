
import React, { useState, useRef, useEffect } from 'react';
import SnowCanvas from './components/SnowCanvas';
import ChristmasTree from './components/ChristmasTree';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Name for the recipient
  const girlFriendName = "Ms. Zhang"; 

  const handleInteraction = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log("Audio playback failed:", err));
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer"
      onClick={handleInteraction}
    >
      {/* Background Music - Festive Jingle Bells */}
      {/* Note: Autoplay requires user interaction in most browsers, so it starts on the first click. */}
      <audio 
        ref={audioRef} 
        src="/bgm.mp3" 
        loop 
        autoPlay
      />

      {/* Background Snow and Click Effects */}
      <SnowCanvas />

      {/* Warm Ambient Flare behind the tree */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Main Content Layer */}
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Top Header Text */}
        <div className="absolute top-10 md:top-14 z-10 text-center px-6 w-full max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-white to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse tracking-tight leading-tight md:leading-normal">
            Merry Christmas, <span className="inline-block whitespace-nowrap">{girlFriendName}!</span>
          </h1>
          <p className="mt-4 md:mt-6 text-white/60 text-xs md:text-lg tracking-[0.2em]">
            Glad to meet you this winter ✨
          </p>
        </div>

        {/* Particle Christmas Tree - Centerpiece */}
        <div className="relative z-0 mt-44 md:mt-52 scale-90 md:scale-100 origin-top">
          <ChristmasTree />
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="fixed inset-0 border-[1px] border-white/5 pointer-events-none z-50"></div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center text-white/10 text-[10px] pointer-events-none tracking-[0.5em]">
      Designed by HCC & built with ❤️.
      </div>
    </div>
  );
};

export default App;

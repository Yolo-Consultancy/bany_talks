import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize2, Minimize2, ListMusic, Zap } from 'lucide-react';
import { Episode } from '../types';

interface AudioPlayerProps {
  activeEpisode: Episode | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  externalSeekTime: number | null;
  clearExternalSeek: () => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
}

export default function AudioPlayer({
  activeEpisode,
  isPlaying,
  setIsPlaying,
  externalSeekTime,
  clearExternalSeek,
  onNextEpisode,
  onPrevEpisode,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isSeekingCustom, setIsSeekingCustom] = useState(false);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetTime = Math.max(0, Math.min(percentage * duration, duration));
    
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const percentage = currentX / rect.width;
    const calculatedTime = Math.max(0, Math.min(percentage * duration, duration));
    
    setHoverTime(calculatedTime);
    setHoverX(currentX);

    if (isSeekingCustom && e.buttons === 1) {
      setCurrentTime(calculatedTime);
      if (audioRef.current) {
        audioRef.current.currentTime = calculatedTime;
      }
    }
  };

  const handleProgressBarMouseLeave = () => {
    setHoverTime(null);
    setHoverX(null);
    setIsSeekingCustom(false);
  };

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeekingCustom(true);
    handleProgressBarClick(e);
  };

  const handleProgressBarMouseUp = () => {
    setIsSeekingCustom(false);
  };

  // Sync state with HTML Audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, activeEpisode, setIsPlaying]);

  // Sync playback rate (speed)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, activeEpisode]);

  // Handle source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    setCurrentTime(0);
  }, [activeEpisode]);

  // Handle external seek requests (such as clicking a timestamp)
  useEffect(() => {
    if (externalSeekTime !== null && audioRef.current) {
      audioRef.current.currentTime = externalSeekTime;
      setCurrentTime(externalSeekTime);
      setIsPlaying(true);
      clearExternalSeek();
    }
  }, [externalSeekTime]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const skipRelative = (seconds: number) => {
    if (audioRef.current) {
      let targetTime = audioRef.current.currentTime + seconds;
      if (targetTime < 0) targetTime = 0;
      if (targetTime > duration) targetTime = duration;
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeEpisode) return null;

  return (
    <div 
      id="floating-audio-player"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-stone-900/95 backdrop-blur-xl border border-stone-800 rounded-2xl shadow-2xl p-4 text-stone-100 transition-all duration-300"
    >
      {/* Underlying raw HTML audio */}
      <audio
        ref={audioRef}
        src={activeEpisode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Bar Wrapper */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Episode Info / Left side */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
          <img 
            src={activeEpisode.thumbnail} 
            alt={activeEpisode.guest.name}
            className="w-12 h-12 object-cover rounded-lg border border-stone-800 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="text-left select-none overflow-hidden">
            <span className="inline-block text-[10px] font-mono tracking-wider text-rose-500 uppercase font-medium bg-rose-500/10 px-1.5 py-0.5 rounded mb-0.5">
              ÉPISODE {activeEpisode.number} • {activeEpisode.category}
            </span>
            <h4 className="text-sm font-semibold text-stone-100 truncate w-64 md:w-56">
              {activeEpisode.title}
            </h4>
            <p className="text-[11px] text-stone-400 font-mono truncate">
              avec {activeEpisode.guest.name}
            </p>
          </div>
        </div>

        {/* Playback Controls / Middle side */}
        <div className="flex flex-col items-center gap-1.5 w-full md:flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={onPrevEpisode}
              disabled={!onPrevEpisode}
              aria-label="Épisode précédent"
              className="text-stone-400 hover:text-stone-100 disabled:opacity-40 transition cursor-pointer"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button 
              onClick={() => skipRelative(-15)}
              aria-label="Reculer de 15 secondes"
              className="text-stone-400 hover:text-stone-100 text-xs font-mono select-none px-1 cursor-pointer"
            >
              -15s
            </button>

            <button 
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Mettre en pause" : "Jouer l'épisode"}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-rose-500 text-stone-950 hover:scale-105 hover:bg-rose-400 active:scale-95 transition cursor-pointer shadow-lg shadow-rose-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-stone-950" /> : <Play className="w-5 h-5 fill-stone-950 ml-0.5" />}
            </button>

            <button 
              onClick={() => skipRelative(15)}
              aria-label="Avancer de 15 secondes"
              className="text-stone-400 hover:text-stone-100 text-xs font-mono select-none px-1 cursor-pointer"
            >
              +15s
            </button>

            <button 
              onClick={onNextEpisode}
              disabled={!onNextEpisode}
              aria-label="Épisode suivant"
              className="text-stone-400 hover:text-stone-100 disabled:opacity-40 transition cursor-pointer"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Scrubber Progress Bar */}
          <div className="flex items-center gap-3 w-full select-none">
            <span className="text-[10px] text-stone-400 font-mono select-none w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div 
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              onMouseMove={handleProgressBarMouseMove}
              onMouseLeave={handleProgressBarMouseLeave}
              onMouseDown={handleProgressBarMouseDown}
              onMouseUp={handleProgressBarMouseUp}
              className="relative flex-1 py-3 cursor-pointer group select-none"
            >
              {/* Track background */}
              <div className="h-1.5 w-full bg-stone-800 rounded-full group-hover:h-2 transition-all duration-200">
                {/* Active fill */}
                <div 
                  className="h-full bg-rose-500 rounded-full relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                >
                  {/* Thumb handle */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-rose-400 rounded-full border border-stone-900 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition duration-150 shadow-md shadow-black/80" />
                </div>
              </div>

              {/* Float Tooltip */}
              {hoverTime !== null && hoverX !== null && (
                <div 
                  className="absolute bottom-6 bg-rose-500 text-stone-950 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider -translate-x-1/2 pointer-events-none shadow-2xl border border-rose-400 z-50 transition-all duration-75"
                  style={{ left: `${hoverX}px` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
            <span className="text-[10px] text-stone-400 font-mono select-none w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Utility / Right side */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Speed badge */}
          <button 
            onClick={cycleSpeed}
            title="Vitesse d'écoute"
            className="flex items-center gap-0.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-rose-500 rounded-lg transition font-mono font-bold cursor-pointer"
          >
            <Zap className="w-3 h-3 text-rose-500" />
            {playbackRate}x
          </button>

          {/* Volume control */}
          <div className="flex items-center gap-2 group">
            <button 
              onClick={toggleMute}
              className="text-stone-400 hover:text-stone-100 transition cursor-pointer"
              aria-label="Activer/désactiver le son"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              title="Volume"
              className="w-16 md:w-20 accent-rose-500 h-1 rounded-lg bg-stone-700 cursor-pointer"
            />
          </div>

          {/* Toggle Expand detail view */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Réduire les crédits" : "Afficher d'autres options"}
            className="text-stone-400 hover:text-stone-100 transition cursor-pointer hidden sm:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded view for citations/lyrics or specific timestamps */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-left animate-fade-in-up">
          <div className="bg-stone-950/40 p-3 rounded-lg border border-stone-800/50">
            <span className="text-[10px] font-mono tracking-wider text-rose-500 block uppercase mb-1">Citation Épisode</span>
            <p className="text-xs text-stone-300 italic">
              "{activeEpisode.quotes[0]?.text || "Excellent contenu inspirant."}"
            </p>
            <span className="text-[10px] text-stone-500 block text-right mt-1.5 font-mono">— {activeEpisode.guest.name}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-wider text-rose-500 block uppercase mb-1">Segments Clés</span>
            <div className="max-h-24 overflow-y-auto space-y-1.5 custom-scrollbar">
              {activeEpisode.timestamps.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start text-xs text-stone-400 hover:text-stone-100 transition">
                  <span className="text-rose-500 font-mono text-[11px] shrink-0 font-bold">{item.time}</span>
                  <span className="truncate">{item.topic}</span>
                </div>
              ))}
              {activeEpisode.timestamps.length > 3 && (
                <div className="text-[10px] text-stone-500 font-mono">Et {activeEpisode.timestamps.length - 3} autres segments...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

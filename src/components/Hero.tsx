import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { HOST_DETAILS } from '../data';
import BanyTypewriterTitle from './BanyTypewriterTitle';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const play = () => {
      video.play().catch(() => setVideoFailed(true));
    };

    play();
    video.addEventListener('canplay', play);
    return () => video.removeEventListener('canplay', play);
  }, [videoFailed]);

  const showPoster = videoFailed || !HOST_DETAILS.heroVideo;

  return (
    <section
      id="hero-section"
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        {!showPoster && (
          <video
            ref={videoRef}
            className="hero-video-bg absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HOST_DETAILS.heroPoster}
            onError={() => setVideoFailed(true)}
          >
            <source src={HOST_DETAILS.heroVideo} type="video/mp4" />
          </video>
        )}

        {showPoster && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={HOST_DETAILS.heroPoster}
              alt=""
              className="hero-poster-zoom absolute inset-0 w-full h-full object-cover object-center"
              aria-hidden
            />
          </div>
        )}

        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/20" aria-hidden />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full px-2 sm:px-4">
        <BanyTypewriterTitle />
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}

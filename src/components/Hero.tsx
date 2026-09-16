import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { HOST_DETAILS } from '../data';
import BanyTypewriterTitle from './BanyTypewriterTitle';

const MOBILE_MQ = '(max-width: 767px)';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => {
      setIsMobile(mq.matches);
      setVideoFailed(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const videoSrc =
    isMobile && HOST_DETAILS.heroVideoMobile
      ? HOST_DETAILS.heroVideoMobile
      : HOST_DETAILS.heroVideo;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed || !videoSrc) return;

    const play = () => {
      video.play().catch(() => setVideoFailed(true));
    };

    play();
    video.addEventListener('canplay', play);
    return () => video.removeEventListener('canplay', play);
  }, [videoFailed, videoSrc]);

  const showPoster = videoFailed || !videoSrc;

  return (
    <section
      id="hero-section"
      className="hero-fullbleed relative -mt-16 w-full flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!showPoster && (
          <video
            key={videoSrc}
            ref={videoRef}
            className="hero-video-bg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            {...{ 'webkit-playsinline': 'true' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {showPoster && (
          <img
            src={HOST_DETAILS.heroPoster}
            alt=""
            className="hero-poster-zoom"
            aria-hidden
          />
        )}

        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/20" aria-hidden />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full px-2 sm:px-4">
        <BanyTypewriterTitle className="scale-[0.78] sm:scale-[0.82] origin-center" />
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onReady?: (player: any) => void;
}

export default function VideoPlayer({ src, poster, onReady }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          controls: true,
          responsive: true,
          fluid: true,
          poster: poster || "",
          playbackRates: [0.5, 1, 1.5, 2],
          controlBar: {
            volumePanel: {
              inline: false,
            },
          },
          html5: {
            vhs: {
              overrideNative: !videojs.browser.IS_SAFARI,
            },
          },
        },
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));

      // Auto-detect video type (MP4 or HLS)
      const videoType = src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4';
      player.src({ src, type: videoType });
    } else {
      const player = playerRef.current;
      const videoType = src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4';
      player.src({ src, type: videoType });
    }
  }, [src, poster, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className="video-player-wrapper" />
      <style jsx global>{`
        .video-js {
          font-family: inherit;
        }
        
        /* Custom purple-pink theme for Video.js */
        .video-js .vjs-big-play-button {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          line-height: 80px;
          font-size: 48px;
          transition: all 0.3s ease;
        }
        
        .video-js .vjs-big-play-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          transform: scale(1.1);
        }
        
        .video-js .vjs-control-bar {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            rgba(0, 0, 0, 0) 100%
          );
          height: 4em;
        }
        
        .video-js .vjs-play-progress {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
        }
        
        .video-js .vjs-volume-level {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
        }
        
        .video-js .vjs-slider {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .video-js .vjs-progress-holder .vjs-play-progress::before {
          color: #ec4899;
          text-shadow: 0 0 10px rgba(236, 72, 153, 0.8);
        }
        
        .video-js .vjs-button > .vjs-icon-placeholder:before {
          line-height: 2em;
        }
        
        .video-js:hover .vjs-big-play-button {
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
        }
      `}</style>
    </div>
  );
}

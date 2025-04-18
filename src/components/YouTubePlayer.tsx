import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          height: string;
          width: string;
          videoId?: string;
          playerVars?: {
            listType?: string;
            list?: string;
            autoplay?: number;
            controls?: number;
            enablejsapi?: number;
            origin?: string;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_API_TIMEOUT = 15000; // 15 seconds timeout

export default function YouTubePlayer() {
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const { currentPlaylist, currentTrack, isPlaying, setPlaying, playNext } = usePlayerStore();

  useEffect(() => {
    let timeoutId: number;
    let retryCount = 0;
    const maxRetries = 3;

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) {
        if (retryCount < maxRetries) {
          console.log(`Retrying YouTube Player initialization (attempt ${retryCount + 1}/${maxRetries})`);
          retryCount++;
          setTimeout(initializePlayer, 1000);
          return;
        }
        console.error('Failed to initialize YouTube Player after retries');
        return;
      }

      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            playsinline: 1,
          },
          events: {
            onReady: () => {
              setIsApiReady(true);
              console.log('YouTube Player ready');
            },
            onStateChange: (event) => {
              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  setPlaying(true);
                  break;
                case window.YT.PlayerState.PAUSED:
                  setPlaying(false);
                  break;
                case window.YT.PlayerState.ENDED:
                  // When the current track ends, play the next one
                  playNext();
                  break;
              }
            },
            onError: (error) => {
              console.error('YouTube Player error:', error);
              setPlaying(false);
              // If there's an error with the current video, try playing the next one
              playNext();
            },
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube Player:', error);
      }
    };

    // Define API ready handler before loading the script
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeoutId);
      initializePlayer();
    };

    // Load the IFrame Player API code asynchronously
    const loadYouTubeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => {
        console.error('Failed to load YouTube IFrame API script');
        if (retryCount < maxRetries) {
          console.log(`Retrying YouTube API load (attempt ${retryCount + 1}/${maxRetries})`);
          retryCount++;
          setTimeout(loadYouTubeAPI, 1000);
        }
      };

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    // Start loading the API
    loadYouTubeAPI();

    // Set a timeout to detect if the API fails to load
    timeoutId = window.setTimeout(() => {
      if (!isApiReady) {
        console.error('YouTube IFrame API failed to load within timeout');
      }
    }, YOUTUBE_API_TIMEOUT);

    return () => {
      window.clearTimeout(timeoutId);
      if (playerRef.current?.destroy && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube Player:', error);
        }
      }
    };
  }, [setPlaying, playNext]);

  // Handle track changes
  useEffect(() => {
    if (!isApiReady || !playerRef.current || !currentTrack?.videoId) {
      return;
    }

    try {
      if (typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById({
          videoId: currentTrack.videoId,
          startSeconds: 0,
        });

        if (isPlaying && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }, [currentTrack, isPlaying, isApiReady]);

  // Handle play/pause state changes
  useEffect(() => {
    if (!isApiReady || !playerRef.current || !currentTrack) {
      return;
    }

    try {
      if (isPlaying && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      } else if (!isPlaying && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error('Error controlling video playback:', error);
    }
  }, [isPlaying, currentTrack, isApiReady]);

  return <div id="youtube-player" className="hidden" />;
}
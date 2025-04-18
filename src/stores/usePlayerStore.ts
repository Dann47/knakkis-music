import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ConfigSettings, Playlist } from '../types';

interface Track {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
}

interface PlayerState {
  isPlaying: boolean;
  currentPlaylist: Playlist | null;
  currentTrack: Track | null;
  queue: Track[];
  originalQueue: Track[];
  isShuffled: boolean;
  config: ConfigSettings | null;
  isConfigLoaded: boolean;
  loadConfig: () => Promise<void>;
  setPlaying: (playing: boolean) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  playListenNow: () => Promise<void>;
  playAllPlaylists: () => Promise<void>;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
}

async function fetchAllPlaylistItems(playlistId: string, apiKey: string): Promise<Track[]> {
  let allTracks: Track[] = [];
  let nextPageToken: string | undefined;

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=snippet,contentDetails&` +
      `maxResults=50&` +
      `playlistId=${playlistId}&` +
      `key=${apiKey}` +
      (nextPageToken ? `&pageToken=${nextPageToken}` : '');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist items: ${response.statusText}`);
    }

    const data = await response.json();
    
    const tracks: Track[] = data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      videoId: item.contentDetails.videoId,
      thumbnail: item.snippet.thumbnails.default.url
    }));

    allTracks = [...allTracks, ...tracks];
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allTracks;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentPlaylist: null,
  currentTrack: null,
  queue: [],
  originalQueue: [],
  isShuffled: false,
  config: null,
  isConfigLoaded: false,

  loadConfig: async () => {
    try {
      // Use anon client to fetch public config
      const { data: configData, error } = await supabase
        .from('config_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading config:', error);
        return;
      }

      if (configData) {
        set({ config: configData, isConfigLoaded: true });
        console.log('Config loaded successfully');
      }
    } catch (error) {
      console.error('Error loading player configuration:', error);
    }
  },

  toggleShuffle: () => {
    const { queue, originalQueue, currentTrack, isShuffled } = get();
    
    if (!isShuffled) {
      const originalQueueToSave = isShuffled ? originalQueue : queue;
      const remainingTracks = queue.filter(track => track.id !== currentTrack?.id);
      const shuffledRemaining = shuffleArray(remainingTracks);
      const newQueue = currentTrack ? [currentTrack, ...shuffledRemaining] : shuffledRemaining;
      
      set({ 
        queue: newQueue,
        originalQueue: originalQueueToSave,
        isShuffled: true 
      });
    } else {
      const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
      const newQueue = [...originalQueue];
      if (currentTrack && currentIndex !== -1) {
        const originalIndex = newQueue.findIndex(track => track.id === currentTrack.id);
        if (originalIndex !== -1) {
          newQueue.splice(originalIndex, 1);
          newQueue.splice(currentIndex, 0, currentTrack);
        }
      }
      
      set({ 
        queue: newQueue,
        isShuffled: false 
      });
    }
  },

  playTrack: (track: Track) => {
    set({ currentTrack: track, isPlaying: true });
  },

  playNext: () => {
    const { queue, currentTrack } = get();
    if (!queue.length || !currentTrack) return;

    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];
    
    set({ currentTrack: nextTrack, isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentTrack } = get();
    if (!queue.length || !currentTrack) return;

    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;

    const previousIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    const previousTrack = queue[previousIndex];
    
    set({ currentTrack: previousTrack, isPlaying: true });
  },

  playListenNow: async () => {
    try {
      const state = get();
      if (!state.isConfigLoaded) {
        await state.loadConfig();
      }

      // Use anon client to fetch public playlists
      const { data: listenNowPlaylist, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('is_listen_now', true)
        .single();

      if (playlistError || !listenNowPlaylist) {
        console.error('No "Listen Now" playlist found:', playlistError);
        return;
      }

      // Use the global config for API key
      const { data: configData, error: configError } = await supabase
        .from('config_settings')
        .select('api_key')
        .limit(1)
        .single();

      if (configError || !configData?.api_key) {
        console.error('YouTube API key not configured:', configError);
        return;
      }

      const tracks = await fetchAllPlaylistItems(listenNowPlaylist.playlist_id, configData.api_key);

      if (!tracks.length) {
        console.error('No tracks found in playlist');
        return;
      }

      set({
        currentPlaylist: listenNowPlaylist,
        queue: tracks,
        originalQueue: tracks,
        currentTrack: tracks[0],
        isPlaying: true,
        isShuffled: false
      });

    } catch (error) {
      console.error('Error playing Listen Now playlist:', error);
    }
  },

  playAllPlaylists: async () => {
    try {
      const state = get();
      if (!state.isConfigLoaded) {
        await state.loadConfig();
      }

      // Use anon client to fetch public playlists
      const { data: playlists, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: true });

      if (playlistsError || !playlists?.length) {
        console.error('No playlists found:', playlistsError);
        return;
      }

      // Use the global config for API key
      const { data: configData, error: configError } = await supabase
        .from('config_settings')
        .select('api_key')
        .limit(1)
        .single();

      if (configError || !configData?.api_key) {
        console.error('YouTube API key not configured:', configError);
        return;
      }

      let allTracks: Track[] = [];

      for (const playlist of playlists) {
        const tracks = await fetchAllPlaylistItems(playlist.playlist_id, configData.api_key);
        allTracks = [...allTracks, ...tracks];
      }

      if (!allTracks.length) {
        console.error('No tracks found in any playlist');
        return;
      }

      set({
        currentPlaylist: null,
        queue: allTracks,
        originalQueue: allTracks,
        currentTrack: allTracks[0],
        isPlaying: true,
        isShuffled: false
      });

    } catch (error) {
      console.error('Error playing all playlists:', error);
    }
  },

  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentPlaylist: (playlist: Playlist | null) => set({ currentPlaylist: playlist }),
  setCurrentTrack: (track: Track | null) => set({ currentTrack: track }),
  setQueue: (tracks: Track[]) => set({ queue: tracks, originalQueue: tracks, isShuffled: false })
}));
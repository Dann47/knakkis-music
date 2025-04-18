export interface Album {
  id: string;
  title: string;
  releaseDate: string;
  coverUrl: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeId: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

export interface ConfigSettings {
  id: string;
  channel_id: string;
  api_key: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  playlist_id: string;
  is_listen_now: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
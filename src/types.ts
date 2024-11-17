export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  duration: string;
}

export interface PlaylistContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setCurrentSong: (song: Song) => void;
  playlist: Song[];
}
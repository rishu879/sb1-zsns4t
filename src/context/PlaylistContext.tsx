import React, { createContext, useState, useContext } from 'react';
import { Song, PlaylistContextType } from '../types';
import { songs } from '../data/songs';

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlaylistContext.Provider value={{
      currentSong,
      isPlaying,
      setIsPlaying,
      setCurrentSong,
      playlist: songs
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
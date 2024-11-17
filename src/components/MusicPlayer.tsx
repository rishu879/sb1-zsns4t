import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlaylist } from '../context/PlaylistContext';

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentSong, isPlaying, setIsPlaying, setCurrentSong, playlist } = usePlaylist();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    setCurrentSong(nextSong);
  };

  const playPrevious = () => {
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const previousSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    setCurrentSong(previousSong);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onEnded={playNext}
      />
      
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{currentSong.title}</h3>
            <p className="text-sm text-gray-500">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={playPrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            className="w-24 accent-indigo-600"
            min="0"
            max="100"
            defaultValue="100"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = parseInt(e.target.value) / 100;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
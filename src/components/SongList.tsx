import React from 'react';
import { Play, Music } from 'lucide-react';
import { usePlaylist } from '../context/PlaylistContext';

export const SongList = () => {
  const { playlist, setCurrentSong, currentSong, setIsPlaying } = usePlaylist();

  const playSong = (song: typeof playlist[0]) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-4">
      {playlist.map((song) => (
        <div
          key={song.id}
          className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
            currentSong?.id === song.id
              ? 'bg-indigo-50 border-indigo-200'
              : 'hover:bg-gray-50 border-transparent'
          } border`}
        >
          <div className="relative group flex-shrink-0">
            <img
              src={song.cover}
              alt={song.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <button
              onClick={() => playSong(song)}
              className={`absolute inset-0 flex items-center justify-center bg-black/40 group-hover:opacity-100 transition-opacity rounded-lg ${
                currentSong?.id === song.id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>

          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900">{song.title}</h3>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <Music className="w-4 h-4" />
            <span className="text-sm">{song.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
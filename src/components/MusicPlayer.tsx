import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, List, Shuffle } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import QueueDrawer from './QueueDrawer';

export default function MusicPlayer() {
  const { isPlaying, currentPlaylist, currentTrack, queue, isShuffled, setPlaying, playNext, playPrevious, toggleShuffle } = usePlayerStore();
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const toggleQueue = () => {
    setIsQueueOpen(!isQueueOpen);
  };

  const handlePlayPause = () => {
    if (!currentTrack) return;
    setPlaying(!isPlaying);
  };

  const handleNext = () => {
    playNext();
  };

  const handlePrevious = () => {
    playPrevious();
  };

  const hasContent = queue.length > 0;

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-player border-t border-gray-200 dark:border-gray-800 p-4 z-[60]"
      >
        <div className="container mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Track Info (Left) */}
            <div 
              onClick={toggleQueue}
              className="flex items-center space-x-4 w-1/3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {currentTrack?.thumbnail && (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className={`w-12 h-12 rounded-lg object-cover shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}
                />
              )}
              <div>
                <h3 className="font-medium dark:text-white line-clamp-1">
                  {currentTrack?.title || 'No track selected'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPlaylist?.name || 'All Playlists'}
                </p>
              </div>
            </div>

            {/* Playback Controls (Center) */}
            <div className="flex items-center justify-center space-x-6 w-1/3">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasContent}
              >
                <SkipBack size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                disabled={!hasContent}
                className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasContent}
              >
                <SkipForward size={20} />
              </motion.button>
            </div>

            {/* Additional Controls (Right) */}
            <div className="flex items-center justify-end space-x-4 w-1/3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleShuffle}
                disabled={!hasContent}
                className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isShuffled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Shuffle size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleQueue}
                disabled={!hasContent}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <List size={20} className="text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Track Info Row */}
            <div 
              onClick={toggleQueue}
              className="flex items-center justify-between mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center space-x-4">
                {currentTrack?.thumbnail && (
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className={`w-12 h-12 rounded-lg object-cover shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}
                  />
                )}
                <div>
                  <h3 className="font-medium dark:text-white line-clamp-1 text-lg">
                    {currentTrack?.title || 'No track selected'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentPlaylist?.name || 'All Playlists'}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Shuffle Button (Left) */}
              <div className="w-1/3 flex justify-start">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleShuffle}
                  disabled={!hasContent}
                  className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isShuffled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Shuffle size={20} />
                </motion.button>
              </div>

              {/* Playback Controls (Center) */}
              <div className="w-1/3 flex items-center justify-center space-x-6">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!hasContent}
                >
                  <SkipBack size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                  disabled={!hasContent}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!hasContent}
                >
                  <SkipForward size={20} />
                </motion.button>
              </div>

              {/* Queue Button (Right) */}
              <div className="w-1/3 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleQueue}
                  disabled={!hasContent}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <List size={20} className="text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <QueueDrawer isOpen={isQueueOpen} onClose={toggleQueue} />
    </>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueDrawer({ isOpen, onClose }: Props) {
  const { currentPlaylist, queue, currentTrack, playTrack } = usePlayerStore();

  const handleTrackClick = (track: any) => {
    playTrack(track);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 md:bottom-[80px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Music2 className="text-purple-600 dark:text-purple-400" size={24} />
                <h2 className="text-xl font-bold dark:text-white">
                  {currentPlaylist ? currentPlaylist.name : 'Queue'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-[80px] md:pb-4">
              {queue.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTrackClick(track)}
                  className={`flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer group ${
                    currentTrack?.id === track.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0 px-3">
                        <p className="font-medium dark:text-white truncate">
                          {track.title}
                        </p>
                        {currentTrack?.id === track.id && (
                          <span className="text-sm text-purple-600 dark:text-purple-400">
                            Now Playing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
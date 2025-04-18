import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import MusicPlayer from './MusicPlayer';
import YouTubePlayer from './YouTubePlayer';
import { useTheme } from '../hooks/useTheme';

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container mx-auto px-4 py-8 pb-36 md:pb-20" // Added bottom padding
      >
        <Outlet />
      </motion.main>
      <YouTubePlayer />
      <MusicPlayer />
    </div>
  );
}
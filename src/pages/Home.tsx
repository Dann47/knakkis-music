import React from 'react';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Music, Play } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import coverImage from "../images/Wells Fargo.png";

export default function Home() {
  const { playListenNow, playAllPlaylists } = usePlayerStore();

  return (
    <>
      <Helmet>
        <title>Knakkis | Home</title>
      </Helmet>
      <div className="fixed inset-0 min-h-screen -mt-16">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={coverImage}
            alt="Knakkis"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Knakkis
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-white/90">
              New Single "Wells Fargo" Out Now
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center space-y-8 mt-12"
          >
            <div className="flex space-x-4">
              <button 
                onClick={playListenNow}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transform transition hover:scale-105 shadow-lg"
              >
                <Play size={20} />
                <span className="font-medium">Listen Now</span>
              </button>
              <button 
                onClick={playAllPlaylists}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center space-x-2 transform transition hover:scale-105 shadow-lg"
              >
                <Music size={20} />
                <span className="font-medium">Listen All</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-8 border-t border-white/20 mt-8"
            >
              <div className="flex items-center space-x-8">
                <a 
                  href="https://www.instagram.com/knakkismusiq/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-purple-400 transition-all hover:scale-110 transform"
                >
                  <Instagram size={28} />
                </a>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-purple-400 transition-all hover:scale-110 transform"
                >
                  <Twitter size={28} />
                </a>
                <a 
                  href="https://www.youtube.com/@knakkismuziqvevo1072" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-purple-400 transition-all hover:scale-110 transform"
                >
                  <Youtube size={28} />
                </a>
                <a 
                  href="https://music.apple.com/us/artist/knakkis/1397004668" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-purple-400 transition-all hover:scale-110 transform"
                >
                  <Music size={28} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
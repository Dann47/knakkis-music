import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Music, Trash2, LogOut, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { usePlayerStore } from '../stores/usePlayerStore';

interface Playlist {
  id: string;
  name: string;
  playlist_id: string;
  is_listen_now: boolean;
}

export default function Config() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [channelId, setChannelId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { loadConfig } = usePlayerStore();

  // Load configuration and playlists on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load config settings
        const { data: configData } = await supabase
          .from('config_settings')
          .select('channel_id, api_key')
          .limit(1)
          .single();

        if (configData) {
          setChannelId(configData.channel_id || '');
          setApiKey(configData.api_key || '');
        }

        // Load playlists
        const { data: playlistsData } = await supabase
          .from('playlists')
          .select('*')
          .order('created_at', { ascending: true });

        if (playlistsData) {
          setPlaylists(playlistsData);
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get existing config ID if any
      const { data: existingConfig } = await supabase
        .from('config_settings')
        .select('id')
        .limit(1)
        .single();

      // Update or insert config
      const { error } = await supabase
        .from('config_settings')
        .upsert({
          id: existingConfig?.id,
          channel_id: channelId,
          api_key: apiKey,
        });

      if (error) throw error;

      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      
      // Reload config in the player store
      await loadConfig();
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleAddPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName && playlistId) {
      try {
        const { data, error } = await supabase
          .from('playlists')
          .insert({
            name: playlistName,
            playlist_id: playlistId,
            is_listen_now: false,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setPlaylists([...playlists, data]);
          setPlaylistName('');
          setPlaylistId('');
        }
      } catch (error) {
        console.error('Error adding playlist:', error);
      }
    }
  };

  const handleSetListenNow = async (id: string) => {
    try {
      // First, remove listen_now from all playlists
      await supabase
        .from('playlists')
        .update({ is_listen_now: false })
        .neq('id', id);

      // Then set the selected playlist as listen_now
      const { error } = await supabase
        .from('playlists')
        .update({ is_listen_now: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPlaylists(playlists.map(playlist => ({
        ...playlist,
        is_listen_now: playlist.id === id,
      })));
    } catch (error) {
      console.error('Error setting listen now playlist:', error);
    }
  };

  const handleRemovePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlaylists(playlists.filter(playlist => playlist.id !== id));
    } catch (error) {
      console.error('Error removing playlist:', error);
    }
  };

  return (
    <>
    <Helmet>
        <title>Knakkis | Configuration</title>
    </Helmet>
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Configuration
          </motion.h1>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* YouTube Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Youtube className="text-purple-600 dark:text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">YouTube Configuration</h2>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Channel ID
                </label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Save size={20} />
                  <span>Save Configuration</span>
                </button>
                <AnimatePresence>
                  {showSaveSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-green-600 dark:text-green-400"
                    >
                      Configuration saved successfully!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Manage Playlists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Music className="text-purple-600 dark:text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Playlists</h2>
            </div>

            <form onSubmit={handleAddPlaylist} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Playlist ID
                  </label>
                  <input
                    type="text"
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus size={20} />
                <span>Add Playlist</span>
              </button>
            </form>

            <div className="space-y-4">
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{playlist.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{playlist.playlist_id}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {playlist.is_listen_now && (
                      <span className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                        <Music size={16} />
                        <span className="text-sm">Listen Now</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleSetListenNow(playlist.id)}
                      className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                    >
                      <Music size={20} />
                    </button>
                    <button
                      onClick={() => handleRemovePlaylist(playlist.id)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
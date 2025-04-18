/*
  # Create config_settings and playlists tables

  1. New Tables
    - `config_settings`
      - `id` (uuid, primary key)
      - `channel_id` (text)
      - `api_key` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_default` (boolean)

    - `playlists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `playlist_id` (text)
      - `is_listen_now` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_default` (boolean)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS config_settings;
DROP TABLE IF EXISTS playlists;

-- Create config_settings table
CREATE TABLE config_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text,
  api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_default boolean DEFAULT false
);

-- Create playlists table
CREATE TABLE playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  playlist_id text NOT NULL,
  is_listen_now boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_default boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE config_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to config" 
  ON config_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to playlists" 
  ON playlists
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to manage config
CREATE POLICY "Allow authenticated users to manage config" 
  ON config_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for authenticated users to manage playlists
CREATE POLICY "Allow authenticated users to manage playlists" 
  ON playlists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
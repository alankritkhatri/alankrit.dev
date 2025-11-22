import { useState, useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

export const useSpotify = () => {
  const [song, setSong] = useState<{
    isPlaying: boolean;
    title?: string;
    artist?: string;
    album?: string;
    albumImageUrl?: string;
    songUrl?: string;
  } | null>(null);

  const accessTokenRef = useRef<string | null>(null);
  const tokenExpiresAtRef = useRef<number>(0);

  useEffect(() => {
    const getAccessToken = async () => {
      if (accessTokenRef.current && Date.now() < tokenExpiresAtRef.current) {
        return accessTokenRef.current;
      }

      const basic = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: REFRESH_TOKEN,
        }),
      });

      const data = await response.json();
      accessTokenRef.current = data.access_token;
      tokenExpiresAtRef.current = Date.now() + data.expires_in * 1000 - 60000;
      return data.access_token;
    };

    const getNowPlaying = async () => {
      try {
        const access_token = await getAccessToken();

        const response = await fetch(NOW_PLAYING_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 204 || response.status > 400) {
          setSong({ isPlaying: false });
          return;
        }

        const song = await response.json();

        if (song.item === null) {
          setSong({ isPlaying: false });
          return;
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists
          .map((_artist: any) => _artist.name)
          .join(", ");
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;

        setSong({
          isPlaying,
          title,
          artist,
          album,
          albumImageUrl,
          songUrl,
        });
      } catch (e) {
        console.error("Error fetching Spotify data", e);
        setSong({ isPlaying: false });
      }
    };

    if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
      getNowPlaying();
      // Poll every 5 seconds
      const interval = setInterval(getNowPlaying, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return song;
};

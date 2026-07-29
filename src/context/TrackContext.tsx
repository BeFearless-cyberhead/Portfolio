'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { Track } from '@/types/portfolio';

interface TrackContextValue {
  activeTrack: Track;
  setActiveTrack: (t: Track) => void;
}

const TrackContext = createContext<TrackContextValue>({
  activeTrack: 'data',
  setActiveTrack: () => {},
});

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const getInitial = (): Track => {
    if (typeof window === 'undefined') return 'data';
    const p = new URLSearchParams(window.location.search).get('track');
    return p === 'ai' ? 'ai' : 'data';
  };

  const [activeTrack, setActiveTrack] = useState<Track>(getInitial);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('track', activeTrack);
    window.history.replaceState({}, '', url);
  }, [activeTrack]);

  return (
    <TrackContext.Provider value={{ activeTrack, setActiveTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export const useTrack = () => useContext(TrackContext);

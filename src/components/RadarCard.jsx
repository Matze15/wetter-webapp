import React, { useState } from 'react';
import { Lock, Unlock, MousePointerClick } from 'lucide-react';

export default function RadarCard({ radar, cityName = 'Berlin' }) {
  const [radarType, setRadarType] = useState('wr'); // 'wr', 'rr', 'wind', 'blitz', 'temp'
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!radar) return null;

  const lat = radar.lat || '52.516';
  const lon = radar.lon || '13.400';

  // Construct iframe URL based on layer
  const getRadarIframeUrl = () => {
    let baseUrl = 'https://radar.wo-cloud.com/desktop/wr/interactive';
    let layerParam = '';

    if (radarType === 'rr') {
      baseUrl = 'https://radar.wo-cloud.com/desktop/rr/interactive';
    } else if (radarType === 'wind') {
      layerParam = '&layer=wind';
    } else if (radarType === 'blitz') {
      layerParam = '&layer=lightning';
    } else if (radarType === 'temp') {
      layerParam = '&layer=temperature';
    }

    return `${baseUrl}?wrx=${lat},${lon}&wrm=8&wry=${lat},${lon}${layerParam}`;
  };

  return (
    <div
      className="w-full apple-glass-card p-4 sm:p-6 mb-6"
      onMouseLeave={() => setIsUnlocked(false)}
    >
      {/* Header Bar: Title & Radar Layer Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
          <h3 className="apple-caption">Wetter- & Regenradar</h3>
          <span className="text-xs text-neutral-500 dark:text-white/50">• {cityName}</span>
        </div>

        {/* Radar Layer Selector (Monochrome Apple Segmented Style) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 dark:bg-black/30 p-1 rounded-xl border border-neutral-200 dark:border-white/10">
          {[
            { id: 'wr', label: 'WetterRadar' },
            { id: 'rr', label: 'RegenRadar' },
            { id: 'wind', label: 'WindRadar' },
            { id: 'blitz', label: 'BlitzRadar' },
            { id: 'temp', label: 'Temperatur' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRadarType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98] ${
                radarType === tab.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-width Radar Viewport Container with Interaction Lock */}
      <div className="relative mt-4 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-black/60 border border-neutral-200 dark:border-white/10 shadow-inner h-[500px] sm:h-[560px] lg:h-[620px] group">
        <iframe
          key={`${radarType}-${lat}-${lon}`}
          src={getRadarIframeUrl()}
          title="WetterOnline Radar Viewport"
          className={`w-full h-full border-0 select-none ${isUnlocked ? 'pointer-events-auto' : 'pointer-events-none'}`}
          allow="geolocation; web-share"
          loading="lazy"
        />

        {/* Lock Overlay when not yet unlocked */}
        {!isUnlocked && (
          <div
            onClick={() => setIsUnlocked(true)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 dark:bg-black/25 backdrop-blur-[1px] hover:backdrop-blur-none cursor-pointer transition-all duration-200"
            title="Klicken, um das Radar zu steuern und zu zoomen"
          >
            <div className="px-4 py-2.5 rounded-2xl apple-glass shadow-lg flex items-center gap-2.5 text-xs font-semibold text-neutral-900 dark:text-white hover:scale-105 active:scale-95 transition-all">
              <MousePointerClick className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
              <span>Zum Zoomen & Steuern klicken</span>
            </div>
          </div>
        )}

        {/* Quick lock button when unlocked */}
        {isUnlocked && (
          <div className="absolute top-3 right-3 z-30 animate-in fade-in duration-200">
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-3 py-1.5 rounded-xl apple-glass shadow-md text-xs font-medium text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/20 transition-all flex items-center gap-1.5"
              title="Radar sperren, um normales Scrollen wieder zu aktivieren"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scrollen freigeben</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


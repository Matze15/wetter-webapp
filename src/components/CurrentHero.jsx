import React from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { Wind, Droplets, Sun, Navigation, Star } from 'lucide-react';

export default function CurrentHero({ weather, isFavorite = false, onToggleFavorite }) {
  if (!weather || !weather.current) return null;

  const { city, current, fourDayForecast } = weather;
  const today = fourDayForecast && fourDayForecast[0];

  const maxTemp = today?.maxTemp ?? current.maxTemp ?? Math.round(current.temp + 2);
  const minTemp = today?.minTemp ?? current.minTemp ?? Math.round(current.temp - 3);

  return (
    <div className="relative overflow-hidden apple-glass-card p-6 sm:p-8 mb-6 transition-all duration-300">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: City & Conditions */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 text-xs font-medium text-neutral-700 dark:text-white/80 backdrop-blur-md">
              <span>{current.stationName || city.name}</span>
              {current.stationTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-white/40" />
                  <span className="text-neutral-500 dark:text-white/60">{current.stationTime}</span>
                </>
              )}
            </div>

            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(city.slug)}
                className="p-1 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-[0.98] border border-neutral-200/60 dark:border-transparent"
                title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-400 dark:text-white/40'}`} />
              </button>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {city.name}
          </h2>

          <div className="flex items-center gap-3 pt-1">
            <WeatherIcon
              symbol={current.symbol}
              condition={current.condition}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-lg sm:text-xl font-medium text-neutral-800 dark:text-white/90 capitalize">
              {current.condition}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-white/70 font-medium pt-1">
            <span>H: {maxTemp}°</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-white/30" />
            <span>T: {minTemp}°</span>
            {current.sunshineToday && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-white/30" />
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300">
                  <Sun className="w-3.5 h-3.5" />
                  {current.sunshineToday}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center / Right: Huge Temperature Display & Wind Direction */}
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-start">
            <span className="apple-display-temp text-neutral-900 dark:text-white select-none">
              {Math.round(current.temp)}
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-400 dark:text-white/70 mt-2">
              °
            </span>
          </div>

          {/* Quick metric pills with Wind Direction Vector */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {current.wind && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100/90 dark:bg-white/10 text-xs text-neutral-800 dark:text-white/90 backdrop-blur-md border border-neutral-200/80 dark:border-white/10">
                <Navigation
                  className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-200 flex-shrink-0"
                  style={{
                    transform: `rotate(${current.windDeg ?? 90}deg)`,
                    transition: 'transform 0.4s ease'
                  }}
                />
                <span className="font-medium">
                  {current.windDir ? `${current.windDir} • ` : ''}{current.wind}
                </span>
              </div>
            )}
            {today?.rainProb && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100/90 dark:bg-white/10 text-xs text-neutral-700 dark:text-white/80 backdrop-blur-md border border-neutral-200/80 dark:border-white/10">
                <Droplets className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span>{today.rainProb}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

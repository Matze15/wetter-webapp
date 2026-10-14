import React from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { Calendar, Sun, Droplets, Navigation } from 'lucide-react';

export default function FourDayForecast({ fourDayForecast = [] }) {
  if (!fourDayForecast || fourDayForecast.length === 0) return null;

  // Temperature color helper
  const getTempColor = (temp, isMax = true) => {
    if (temp >= 20) return isMax ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600 dark:text-amber-400';
    if (temp >= 14) return isMax ? 'text-orange-500 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400';
    return isMax ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <section className="apple-glass-card p-4 sm:p-5 mb-6 overflow-hidden">
      {/* 1. Header Title */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10 mb-4 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="apple-caption">4-Tage-Vorhersage</h3>
        </div>
      </div>

      {/* 2. 4-Day Comparative Column Grid (divided by vertical hairline lines) */}
      <div className="overflow-x-auto apple-scrollbar pb-1">
        <div className="grid grid-cols-4 divide-x divide-neutral-200/80 dark:divide-white/10 min-w-[360px] sm:min-w-full">
          {fourDayForecast.slice(0, 4).map((day, dIdx) => {
            return (
              <div
                key={day.dayIndex ?? dIdx}
                className="flex flex-col px-2 sm:px-3 text-center"
              >
                {/* Header: Date & Day Name */}
                <div className="pb-3 border-b border-neutral-200/60 dark:border-white/5">
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block truncate">
                    {day.dateStr || `Tag ${dIdx + 1}`}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight capitalize mt-0.5 truncate">
                    {day.dayLabel}
                  </h4>
                </div>

                {/* Stacked Temperatures (max / min with divider) */}
                <div className="py-2.5 flex flex-col items-center justify-center border-b border-neutral-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
                      max
                    </span>
                    <span className={`text-base sm:text-lg font-bold tabular-nums ${getTempColor(day.maxTemp, true)}`}>
                      {day.maxTemp}°
                    </span>
                  </div>

                  <div className="w-12 h-[1px] bg-neutral-200/90 dark:bg-white/10 my-1" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
                      min
                    </span>
                    <span className={`text-sm sm:text-base font-semibold tabular-nums ${getTempColor(day.minTemp, false)}`}>
                      {day.minTemp}°
                    </span>
                  </div>
                </div>

                {/* 4 Times of Day Slots (Vormittag, Nachmittag, Abend, Nacht) */}
                <div className="divide-y divide-neutral-100 dark:divide-white/5 flex-1">
                  {day.parts && day.parts.map((part, pIdx) => {
                    return (
                      <div
                        key={part.name || pIdx}
                        className="py-3 sm:py-3.5 flex flex-col items-center justify-center transition-colors group"
                        title={`${part.name}: ${part.condition} • Wind ${part.windDir}`}
                      >
                        {/* Weather Icon + Wind Arrow */}
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <WeatherIcon
                            symbol={part.symbol}
                            condition={part.condition}
                            className="w-8 h-8 sm:w-9 sm:h-9"
                          />
                          <Navigation
                            className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400 flex-shrink-0 transition-transform duration-300"
                            style={{ transform: `rotate(${part.windDeg ?? 90}deg)` }}
                            title={`Wind ${part.windDir}`}
                          />
                        </div>

                        {/* Slot Name Label */}
                        <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-tight block">
                          {part.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Metrics: Sunshine Hours & Rain Probability */}
                <div className="pt-3 pb-1 border-t border-neutral-200/60 dark:border-white/5 space-y-1.5 mt-auto">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="tabular-nums">{day.sunshine}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="tabular-nums">{day.rainProb}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

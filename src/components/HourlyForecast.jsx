import React from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { Clock, Droplets, Navigation, Calendar } from 'lucide-react';

const GERMAN_WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export default function HourlyForecast({ hourlyForecast = [] }) {
  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  // Track midnight transitions to insert "Morgen" and next day markers
  let dayOffset = 0;
  const today = new Date();

  return (
    <section className="apple-glass-card p-5 mb-6">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="apple-caption">Stündliche Vorhersage (nächste 48 Stunden)</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto apple-scrollbar pb-3 pt-1 px-1">
        {hourlyForecast.map((hour, idx) => {
          const isFirst = idx === 0;
          const isMidnight = idx > 0 && hour.time === '00:00';

          let daySeparatorElement = null;
          if (isMidnight) {
            dayOffset += 1;
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + dayOffset);
            const weekdayName = GERMAN_WEEKDAYS[targetDate.getDay()];
            const dayLabel = dayOffset === 1 ? 'Morgen' : dayOffset === 2 ? 'Übermorgen' : weekdayName;

            daySeparatorElement = (
              <div
                key={`separator-day-${dayOffset}`}
                className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-neutral-200/80 dark:bg-white/10 border border-neutral-300/80 dark:border-white/20 text-center shadow-sm min-w-[96px] mx-1"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 dark:text-white tracking-wider uppercase mb-1">
                  <Calendar className="w-3 h-3 text-neutral-600 dark:text-neutral-300" />
                  <span>{dayLabel}</span>
                </div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white/95">
                  {weekdayName}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-white/50 mt-0.5">
                  00:00 Uhr
                </span>
              </div>
            );
          }

          return (
            <React.Fragment key={`hour-frag-${idx}`}>
              {daySeparatorElement}
              <div
                className={`flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-150 min-w-[82px] sm:min-w-[88px] text-center ${
                  isFirst
                    ? 'bg-white dark:bg-white/15 border border-neutral-300 dark:border-white/25 shadow-sm'
                    : 'bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/70 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/10'
                }`}
              >
                {/* Time */}
                <span className={`text-xs font-semibold ${isFirst ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-600 dark:text-white/80'}`}>
                  {isFirst ? 'Jetzt' : hour.time}
                </span>

                {/* Weather Icon */}
                <div className="my-2">
                  <WeatherIcon
                    symbol={hour.symbol}
                    condition={hour.condition}
                    className="w-8 h-8"
                  />
                </div>

                {/* Temperature */}
                <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                  {Math.round(hour.temp)}°
                </span>

                {/* Rain Probability */}
                {hour.rainProb && hour.rainProb !== '0%' ? (
                  <div className="flex items-center gap-0.5 text-[10px] text-slate-600 dark:text-slate-300 font-medium mt-1">
                    <Droplets className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                    <span>{hour.rainProb}</span>
                  </div>
                ) : (
                  <div className="h-4 mt-1" />
                )}

                {/* Wind Vector Arrow & Exact Wind Speed */}
                <div
                  className="mt-2 pt-1.5 border-t border-neutral-200/80 dark:border-white/10 flex items-center justify-center gap-1 text-[10px] text-neutral-600 dark:text-white/70 w-full"
                  title={`${hour.windDir} (~${hour.windSpeed || 15} km/h)`}
                >
                  <Navigation
                    className="w-2.5 h-2.5 text-neutral-600 dark:text-neutral-300 flex-shrink-0"
                    style={{
                      transform: `rotate(${hour.windDeg ?? 90}deg)`
                    }}
                  />
                  <span className="tabular-nums font-medium text-neutral-800 dark:text-white/80">
                    {hour.windSpeed || 15} <span className="text-[9px] text-neutral-400 dark:text-white/40">km/h</span>
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
